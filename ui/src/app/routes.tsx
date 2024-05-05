import { ComponentType } from "react";
import { makeAutoObservable } from "mobx";
import { MainPage } from "../pages/main/main.page";

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
    path: "/",
    component: () => <MainPage />,
    title: "Главная"
  }
];

class routesStore {
  constructor() {
    makeAutoObservable(this);
  }

  get routes() {
    return globalRoutes;
  }
}

export const RoutesStore = new routesStore();
