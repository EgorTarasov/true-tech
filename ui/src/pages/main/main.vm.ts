import { makeAutoObservable } from "mobx";

export class MainPageViewModel {
  constructor() {
    makeAutoObservable(this);
    void this.init();
  }

  async init() {}
}

export const MainPageStore = new MainPageViewModel();
