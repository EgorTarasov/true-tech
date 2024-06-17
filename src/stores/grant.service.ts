import { makeAutoObservable } from "mobx";
import { AuthService } from "./auth.service";
import { isLoggedIn } from "@/utils/auth";

class grantService {
  constructor() {
    makeAutoObservable(this);
  }

  get canReadDirectory() {
    if (!isLoggedIn(AuthService.auth)) return false;

    return true;
  }

  get canReadMap() {
    return isLoggedIn(AuthService.auth);
  }
}

export const GrantsService = new grantService();
