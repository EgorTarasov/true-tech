import { z } from "zod";

export namespace WeatherDto {
  export const Item = z.object({
    elevation: z.number(),
    generationtime_ms: z.number(),
    current: z.object({
      temperature_2m: z.number(),
      time: z.string()
    }),
    latitude: z.number(),
    longitude: z.number(),
    timezone: z.string(),
    timezone_abbreviation: z.string(),
    utc_offset_seconds: z.number()
  });
}
