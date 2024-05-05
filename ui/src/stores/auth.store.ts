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
      data: { lol: 123 };
    };

class authService {
  item: AuthState = {
    state: "loading",
    data: null
  };

  constructor() {
    makeAutoObservable(this);
  }
}

export const AuthService = new authService();
