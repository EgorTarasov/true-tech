import { Auth } from "@/types/auth.type";

export const isLoggedIn = (state: Auth.State): state is Auth.Authenticated =>
  state.state === "authenticated";
