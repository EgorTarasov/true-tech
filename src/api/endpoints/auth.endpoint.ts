import api from "api/utils/api";
import { AuthDto } from "../models/auth.model";

export namespace AuthEndpoint {
  export type LoginTemplate = {
    email: string;
    password: string;
  };
  export const login = async (v: LoginTemplate) => api.post("/users/login", AuthDto.Token, v);

  export type RegisterTemplate = {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  };
  export const register = async (v: RegisterTemplate) =>
    api.post("/users/register", AuthDto.Token, v);
}
