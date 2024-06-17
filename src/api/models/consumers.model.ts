import { z } from "zod";
import { EventDto } from "./event.model";
export namespace ConsumersDto {
  export const Filters = z
    .object({
      filterName: z.string(),
      values: z.string().array()
    })
    .array();

  export const StateHeat = z.object({
    admDistrict: z.string(),
    material: z.string(),
    municupalDistrict: z.string(),
    purpose: z.string(),
    type: z.string(),
    area: z.string().nullable(),
    floors: z.string(),
    propertyClass: z.string(),
    unom: z.number(),
    События: EventDto.Item.array().nullable(),
    priority: z.number()
  });
  export type StateHeat = z.infer<typeof StateHeat>;

  export const Item = z.object({
    stateHeatConsumers: StateHeat.array(),
    mkdConsumers: z
      .object({
        deprecation: z.number(),
        address: z.string(),
        apartments: z.number(),
        fullAddress: z.string(),
        country: z.string(),
        district: z.string(),
        feature: z.number(),
        entrances: z.number(),
        externalID: z.number(),
        floors: z.number(),
        state: z.number(),
        PassengerElevator: z.number(),
        projectSeries: z.number(),
        roofCleaningSequence: z.number(),
        totalArea: z.number(),
        unom: z.number(),
        wallMaterial: z.number(),
        roofMaterials: z.number(),
        totalLivingArea: z.number(),
        serviceElevator: z.number(),
        totalNonLivingArea: z.number().or(z.string()),
        typesOfHousingStock: z.number(),
        События: EventDto.Item.array().nullable()
      })
      .array()
      .nullable()
  });
  export type Item = z.infer<typeof Item>;
}
