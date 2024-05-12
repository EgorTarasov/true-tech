import { AuthEndpoint } from "api/endpoints/auth.endpoint";
import { AuthDto } from "api/models/auth.model";
import { removeStoredAuthToken, setStoredAuthToken } from "api/utils/authToken";
import { makeAutoObservable } from "mobx";

export type AuthState =
  | {
      state: "loading";
      data: null;
    }
  | {
      state: "anonymous";
      data: null;
    }
  | {
      state: "authenticated";
      data: {
        user: AuthDto.Item;
      };
    };

class authService {
  item: AuthState = {
    state: "loading",
    data: null
  };

  constructor() {
    makeAutoObservable(this);
    void this.init();
  }

  private async init() {
    try {
      const user = await AuthEndpoint.current();

      this.item = {
        state: "authenticated",
        data: {
          user
        }
      };
    } catch {
      this.item = { state: "anonymous", data: null };
    }
  }

  public async loginVk(code: string): Promise<boolean> {
    try {
      const res = await AuthEndpoint.loginVk(code);
      setStoredAuthToken(res.accessToken);
      await this.init();
    } catch {
      this.item = { state: "anonymous", data: null };
    }
    return false;
  }

  async login(email: string, password: string) {
    const res = await AuthEndpoint.login(email, password);
    setStoredAuthToken(res.accessToken);
    await this.init();
  }

  async register(email: string, password: string) {
    const res = await AuthEndpoint.register(email, password);
    setStoredAuthToken(res.accessToken);
    await this.init();
  }

  logout() {
    removeStoredAuthToken();
    this.item = { state: "anonymous", data: null };
  }
}

export const AuthService = new authService();
