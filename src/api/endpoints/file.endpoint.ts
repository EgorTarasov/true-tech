import { z } from "zod";
import api from "../utils/api";

export namespace FileEndpoint {
  export const predict = (
    admArea: string,
    startDate: string,
    endDate: string,
  ) =>
    api.post(
      `/data/predict?admArea=${admArea}&endDate=${endDate}&startDate=${startDate}&threshold=0.8`,
      z.any(),
      {},
    );

  export const create = (title: string, startDate: string, endDate: string) =>
    api.post(
      `/reports/create?title=${title}&endDate=${endDate}&startDate=${startDate}`,
      z.any(),
      {},
    );

  export const getResult = (id: string) => api.get(`/reports/${id}`, z.any());
}
