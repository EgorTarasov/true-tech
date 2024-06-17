import { AuthEndpoint } from "@/api/endpoints/auth.endpoint";
import { UserEndpoint } from "@/api/endpoints/user.endpoint";
import { authToken } from "@/api/utils/authToken";
import { Auth } from "@/types/auth.type";
import { makeAutoObservable, when } from "mobx";

class AuthServiceViewModel {
  public auth: Auth.State = { state: "loading" };

  constructor() {
    makeAutoObservable(this);
    void this.init();
    // this.auth = {
    //   state: "authenticated",
    //   user: {
    //     id: 1
    //   }
    // };
  }

  private async init() {
    if (!authToken.get()) {
      this.auth = { state: "anonymous" };
      return;
    }

    try {
      const user = await UserEndpoint.current();
      this.auth = { state: "authenticated", user };
    } catch {
      this.auth = { state: "anonymous" };
    }
  }

  login = async (v: AuthEndpoint.LoginTemplate): Promise<boolean> => {
    try {
      const token = await AuthEndpoint.login(v);
      authToken.set(token.accessToken);

      const user = await UserEndpoint.current();
      this.auth = { state: "authenticated", user };
      return true;
    } catch {
      return false;
    }
  };

  async waitInit() {
    await when(() => this.auth.state !== "loading");
  }

  // loginViaVk = async (code: unknown): Promise<boolean> => {
  //   try {
  //     await AuthEndpoint.loginViaVk(code);

  //     const user = await UserEndpoint.current();
  //     this.auth = { state: "authenticated", user };
  //     return true;
  //   } catch {
  //     toast({
  //       variant: "destructive",
  //       description: "Не удалось войти через ВКонтакте",
  //       title: "Ошибка входа"
  //     });
  //     return false;
  //   }
  // };

  register = async (v: AuthEndpoint.RegisterTemplate): Promise<boolean> => {
    try {
      const token = await AuthEndpoint.register(v);
      authToken.set(token.accessToken);

      const user = await UserEndpoint.current();
      this.auth = { state: "authenticated", user };
      return true;
    } catch {
      return false;
    }
  };

  logout() {
    this.auth = { state: "anonymous" };
    authToken.remove();
  }

  // async updatePassword(token: string, newPassword: string) {
  //   try {
  //     await AuthEndpoint.resetPassword(token, newPassword);

  //     const user = await UserEndpoint.current();
  //     this.auth = { state: "authenticated", user };
  //     return true;
  //   } catch {
  //     return false;
  //   }
  // }
}

export const AuthService = new AuthServiceViewModel();
