import { z } from "zod";

export namespace MapDto {
  export const HeatingPointAddress = z.object({
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
  });

  export const ConsumerPointAddress = z.object({
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
  });

  export const Property = z.object({
    balance_holder: z.string(),
    commissioning_date: z.number(),
    heating_point_src: z.string(),
    heating_point_number: z.string(),
    heating_point_type: z.string(),
    heating_point_location_type: z.string(),
    municipal_district: z.string(),
    consumer_full_address: ConsumerPointAddress,
    heating_point_full_address: HeatingPointAddress,
    consumers: ConsumerPointAddress.array().nullable(),
    priority: z.number(),
  });
  export type Property = z.infer<typeof Property>;
}
