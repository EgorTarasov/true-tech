import { z } from "zod";
import { MapDto } from "./map.model";
import { ConsumersDto } from "./consumers.model";

export namespace IncidentDto {
  export const IncidentHeatingPoints = z.object({
    priority: z.number(),
    unom: z.number(),
    balance_holder: z.string(),
    commissioning_date: z.number(),
    heating_point_src: z.string(),
    heating_point_number: z.string(),
    heating_point_type: z.string(),
    heating_point_location_type: z.string(),
    municipal_district: z.string(),
    consumer_full_address: z.object({
      unom: z.number(),
      address: z.string(),
      border: z
        .array(
          z.object({
            Key: z.string(),
            Value: z
              .string()
              .or(z.number().array().length(2).array().array())
              .or(z.any()),
          }),
        )
        .nullable(),
      municipalDistrict: z.string(),
      center: z.object({
        type: z.string(),
        coordinates: z.array(z.number()).nullable(),
      }),
    }),
    heating_point_full_address: z.object({
      unom: z.number(),
      address: z.string(),
      municipalDistrict: z.string(),
      border: z
        .array(
          z.object({
            Key: z.string(),
            Value: z
              .string()
              .or(z.number().array().length(2).array().array())
              .or(z.any()),
          }),
        )
        .nullable(),
      center: z.object({
        type: z.string(),
        coordinates: z.array(z.number()).nullable(),
      }),
    }),
    consumers: z
      .object({
        address: z.string(),
        border: z
          .array(
            z.object({
              Key: z.string(),
              Value: z
                .string()
                .or(z.number().array().length(2).array().array())
                .or(z.any()),
            }),
          )
          .nullable(),
        center: z.object({
          type: z.string(),
          coordinates: z.array(z.number()).nullable(),
        }),
        unom: z.number(),
        municipalDistrict: z.string(),
      })
      .array(),
  });

  export const Item = z.object({
    id: z.number(),
    description: z.string().optional(),
    system: z.string(),
    externalCreated: z.string(),
    completed: z.string().nullable(), // wtf???
    regionName: z.string(),
    unom: z.number(),
    addressInEvent: z.string(),
    predictionId: z.string().or(z.number()).nullable(),
    uploadId: z.string().or(z.number()).nullable(),
    heatPoint: IncidentHeatingPoints.nullable(),
    stateConsumers: ConsumersDto.StateHeat.array().nullable(),
    measurements: z.null(), // wtf???
  });
  export type Item = z.infer<typeof Item>;
}
