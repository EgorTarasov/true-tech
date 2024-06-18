import { z } from "zod";
import { IncidentDto } from "../models/incident.model";
import api from "../utils/api";
import mock from "@/constants/mock-issue.json";

export namespace IncidentsEndpoint {
  export const getRecents = (offset: number, limit: number) => {
    console.log(offset, limit);
    try {
      // return IncidentDto.Item.array().parse(mock);
      return api.get(
        `/issue/list/v1?limit=200&offset=180`,
        IncidentDto.Item.array(),
      );
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.log(error.errors);
      }
      throw error;
    }
  };
}
