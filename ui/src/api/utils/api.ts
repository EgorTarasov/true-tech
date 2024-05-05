import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { getStoredAuthToken, removeStoredAuthToken } from "./authToken";

axios.defaults.baseURL = import.meta.env.VITE_API_URL;

const getConfig = (config?: AxiosRequestConfig<unknown>) => ({
  ...config,
  headers: {
    Authorization: getStoredAuthToken() ? `Bearer ${getStoredAuthToken()}` : undefined,
    "Access-Control-Allow-Origin": "*",
    ...config?.headers
  }
});

const handleRequest = async <T>(req: () => Promise<AxiosResponse>): Promise<T> => {
  return new Promise((res, rej) =>
    req()
      .then((response: AxiosResponse) => res(response.data))
      .catch((error) => {
        if (error.response) {
          if (error.response.status === 401) {
            removeStoredAuthToken();
            if (window?.location) {
              window.location.replace("/login");
            }
          }
          rej(error.response.data);
        } else {
          rej(error);
        }
      })
  );
};

const get = <T>(path: string, config?: AxiosRequestConfig<unknown>): Promise<T> =>
  handleRequest(() => axios.get(path, getConfig(config)));

const post = <T>(
  path: string,
  variables?: unknown,
  config?: AxiosRequestConfig<unknown>
): Promise<T> => handleRequest(() => axios.post(path, variables, getConfig(config)));

const put = <T>(
  path: string,
  variables?: unknown,
  config?: AxiosRequestConfig<unknown>
): Promise<T> => handleRequest(() => axios.put(path, variables, getConfig(config)));

const del = <T>(path: string, config?: AxiosRequestConfig<unknown>): Promise<T> =>
  handleRequest(() => axios.delete(path, getConfig(config)));

export default {
  get,
  post,
  put,
  delete: del
};
