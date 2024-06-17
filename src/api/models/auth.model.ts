import { z } from "zod";

export namespace AuthDto {
  export const Token = z.object({
    accessToken: z.string()
  });
}
