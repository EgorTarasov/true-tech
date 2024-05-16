import { DynamicFormViewModel } from "@/components/dynamic-form/dynamic-form.vm";
import { AuthEndpoint } from "api/endpoints/auth.endpoint";
import { FormEndpoint } from "api/endpoints/form.endpoint";
import { AuthDto } from "api/models/auth.model";
import { FormDto } from "api/models/form.model";
import { makeAutoObservable } from "mobx";

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
      this.cards = (await AuthEndpoint.getCards()).accounts;
      console.log(this.cards);
    } finally {
      this.isLoading = false;
    }
  }

  submitDynamicForm(v: [label: string, value: string][]) {
    this.selectedForm = null;
  }

  isLoading = true;
  forms: FormDto.Item[] = [];
  selectedCustomForm: CustomFormType | null = null;
  selectedForm: DynamicFormViewModel | null = null;
  cards: AuthDto.Card[] = [];
}
