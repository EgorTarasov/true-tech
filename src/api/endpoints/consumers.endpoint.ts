import { z } from "zod";
import api from "../utils/api";
import { ConsumersDto } from "../models/consumers.model";
import { MapDto } from "../models/map.model";

export namespace ConsumersEndpoint {
  export const getFilters = () => api.get("/consumers/filters", ConsumersDto.Filters);

  export const getByUnom = (unom: string) =>
    api.get(`/consumers/info/?unoms=${unom}`, ConsumersDto.Item);
}
