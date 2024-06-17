import { HeatDistributorsEndpoint } from "@/api/endpoints/heat-distributors.endpoint";
import { HeatDistributor } from "@/types/heat.type";
import { makeAutoObservable } from "mobx";

export class HeatDistributorViewModel {
  constructor() {
    makeAutoObservable(this);
  }

  item: HeatDistributor.Item | null = null;
  loading = true;

  async init(unom: string) {
    this.loading = true;
    try {
      const res = await HeatDistributorsEndpoint.getByUnom(unom);
      this.item = HeatDistributor.convertDto(res);
    } finally {
      this.loading = false;
    }
  }
}
