import { AuthDto } from "api/models/auth.model";
import api from "api/utils/api";

export namespace AuthEndpoint {
  export const login = (email: string, password: string) => {
    return api.post<{ accessToken: string }>("/auth/login", { email, password });
  };

  export const register = (email: string, password: string) => {
    return api.post<{ accessToken: string }>("/auth/register", { email, password });
  };

  export const current = () => {
    return api.get<AuthDto.Item>("/auth/me");
  };

  export const account = () => {
    return api.get<AuthDto.Account>("/accounts/my");
  };
}