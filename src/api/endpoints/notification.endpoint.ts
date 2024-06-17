import { z } from "zod";
import api from "../utils/api";

export namespace NotificationEndpoint {
  export const getAll = () => api.get("/message", z.any());
}
