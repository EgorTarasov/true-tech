import { MapDto } from "../models/map.model";
import api from "../utils/api";

export namespace HeatDistributorsEndpoint {
  export const getByUnom = (unom: string) => api.get(`/source/q/${unom}`, MapDto.Property);
}
