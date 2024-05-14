import { DynamicFormViewModel } from "@/components/dynamic-form/dynamic-form.vm";
import { FormEndpoint } from "api/endpoints/form.endpoint";
import { FormDto } from "api/models/form.model";
import { makeAutoObservable, toJS } from "mobx";

export type CustomFormType = "bank-form" | "create-form";

export class MainPageViewModel {
  constructor() {
    makeAutoObservable(this);
    void this.init();
  }

  async init() {
    this.isLoading = true;
    try {
      this.forms = (await FormEndpoint.getTemplates()).forms;
    } finally {
      this.isLoading = false;
    }
  }

  isLoading = true;
  forms: FormDto.Item[] = [];
  selectedCustomForm: CustomFormType | null = null;
  selectedForm: DynamicFormViewModel | null = null;
}
