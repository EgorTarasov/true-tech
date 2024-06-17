import { z } from "zod";

export namespace EventDto {
  export const Item = z.object({
    address: z.string(),
    country: z.string(),
    ended_at: z.string(),
    external_closed_at: z.string(),
    src: z.string(),
    title: z.string(),
    unom: z.number(),
    external_created_at: z.string(),
    external_ended_at: z.string()
  });
}
