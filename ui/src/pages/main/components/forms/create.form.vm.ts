import { makeAutoObservable } from "mobx";
import { MainPageViewModel } from "../../main.vm";
import { FormDto } from "api/models/form.model";
import { FormEndpoint } from "api/endpoints/form.endpoint";

export class CreateFormViewModel {
  constructor(private parentVm: MainPageViewModel) {
    makeAutoObservable(this);
    void this.init();
  }

  async init() {
    try {
      this.fields = (await FormEndpoint.getFields()).fields;
    } finally {
      this.loading = false;
    }
  }

  loading = true;
  name = "";
  fields: FormDto.Field[] = [];
  selectedFields: FormDto.Field[] = [];
  get formValid() {
    return this.selectedFields.length > 0 && this.name.length > 0;
  }

  async createForm() {
    this.loading = true;
    try {
      const res = await FormEndpoint.createForm({
        name: this.name,
        fields: this.selectedFields.map((v) => v.id)
      });

      this.parentVm.forms.push(res);
      this.parentVm.selectedCustomForm = null;
    } finally {
      this.loading = false;
    }
  }
}
