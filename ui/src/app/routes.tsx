import { ComponentType } from "react";
import { makeAutoObservable } from "mobx";
import { MainPage } from "../pages/main/main.page";
import { AuthService } from "../stores/auth.store";
import LoginPage from "../pages/login/login.page";
import { AssistantPage } from "../pages/assistant/assistant.page";

export interface RouteType {
  path: string;
  component: ComponentType;
  title: string;
  showInNav?: boolean;
  disabled?: boolean;
}

export const RoutesWithoutNav = [];

export const globalRoutes: RouteType[] = [
  {
    path: "/login",
    component: () => <LoginPage />,
    title: "Вход"
  }
];

export const privateRoutes: RouteType[] = [
  {
    path: "/",
    component: () => <MainPage />,
    title: "Главная"
  },
  {
    path: "/assistant",
    component: () => <AssistantPage />,
    title: "Ассистент"
  }
];

class routesStore {
  constructor() {
    makeAutoObservable(this);
  }

  get routes(): RouteType[] {
    return [...globalRoutes, ...(AuthService.item.state === "authenticated" ? privateRoutes : [])];
  }
}

export const RoutesStore = new routesStore();
