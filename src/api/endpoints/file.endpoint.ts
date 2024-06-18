import { z } from "zod";
import api from "../utils/api";

export namespace FileEndpoint {
  export const predict = (
    admArea: string,
    endDate: string,
    startDate: string,
  ) =>
    api.post(
      `/data/predict?admArea=${admArea}&endDate=${endDate}&startDate=${startDate}&threshold=0.8`,
      z.any(),
      {},
    );
}
