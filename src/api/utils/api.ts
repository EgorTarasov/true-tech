/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosRequestConfig, AxiosResponse, CanceledError } from "axios";
import { ZodObject, z } from "zod";
import { authToken } from "./authToken";
import { toast } from "sonner";

axios.defaults.baseURL = "https://api.lct.larek.tech/";

type Schema = ZodObject<any> | z.ZodArray<ZodObject<any> | z.ZodAny> | z.ZodAny;

const getConfig = (config?: AxiosRequestConfig<unknown>) => ({
  ...config,
  headers: {
    Authorization: `Bearer ${authToken.get()}`,
    "Access-Control-Allow-Origin": "*",
    ...config?.headers
  }
});

const handleRequest = async <T extends Schema>(
  req: () => Promise<AxiosResponse>,
  schema: T
): Promise<z.infer<T>> => {
  try {
    const res = await req();

    if (schema) {
      const validatedData = schema.parse(res.data);

      return validatedData;
    }

    return res as any;
  } catch (error) {
    if (error instanceof z.ZodError) {
      toast.error("Модели разошлись", {
        description: error.errors.map((e) => e.message).join("\n")
      });
      console.error("Validation error:", error.errors);
    } else if (error instanceof CanceledError) {
      console.debug("Запрос отменен");
      throw error;
    } else if (axios.isAxiosError(error)) {
      switch (error.response?.status) {
        case 401:
          toast.error("Сессия истекла, пожалуйста, войдите снова");
          authToken.remove();
          window.location.replace("/login");
          break;
        case 500:
          toast.error("Ошибка", {
            description:
              (error.response.data as any)?.error ?? "Мы все узнаем и починим, попробуйте позже"
          });
          break;
        default:
          // toast.error("Неизвестная ошибка при выполнении запроса");
          break;
      }
    } else {
      toast.error("Неизвестная ошибка при выполнении запроса");
    }
    throw error;
  }
};

const get = <T extends Schema>(
  path: string,
  schema: T,
  config?: AxiosRequestConfig<unknown>
): Promise<z.infer<T>> => handleRequest(() => axios.get(path, getConfig(config)), schema);

const post = <T extends Schema>(
  path: string,
  schema: T,
  variables?: unknown,
  config?: AxiosRequestConfig<unknown>
): Promise<z.infer<T>> =>
  handleRequest(() => axios.post(path, variables, getConfig(config)), schema);

const put = <T extends Schema>(
  path: string,
  schema: T,
  variables?: unknown,
  config?: AxiosRequestConfig<unknown>
): Promise<z.infer<T>> =>
  handleRequest(() => axios.put(path, variables, getConfig(config)), schema);

const del = <T extends Schema>(
  path: string,
  schema: T,
  config?: AxiosRequestConfig<unknown>
): Promise<z.infer<T>> => handleRequest(() => axios.delete(path, getConfig(config)), schema);

export default {
  get,
  post,
  put,
  delete: del
};
