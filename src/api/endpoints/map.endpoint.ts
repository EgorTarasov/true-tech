import { GenericAbortSignal } from "axios";
import { MapDto } from "../models/map.model";
import api from "../utils/api";

export namespace MapEndpoint {
  export const getProperty = (
    latitude: number,
    longitude: number,
    radius: number
    // signal: GenericAbortSignal
  ) =>
    api
      .get("/consumers/q", MapDto.Property.array(), {
        params: { latitude, longitude, radius }
      })
      .then((v) => {
        console.log(v[0]);
        return v;
      });
}
