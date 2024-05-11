import { makeAutoObservable } from "mobx";
import { MainPageViewModel } from "../../main.vm";
import { FormDto } from "api/models/form.model";
import { FormEndpoint } from "api/endpoints/form.endpoint";

export class CreateFormViewModel {
  constructor(private parentVm: MainPageViewModel) {
    makeAutoObservable(this);
    this.createField();
  }

  name = "";
  fields: FormDto.TemplateField[] = [];

  createField() {
    this.fields.push({ label: "", type: "text" });
  }

  deleteField(index: number) {
    this.fields.splice(index, 1);
  }

  async createForm() {
    const res = await FormEndpoint.createForm({
      name: this.name,
      fields: this.fields
    });

    this.parentVm.forms.push(res);
    this.parentVm.selectedCustomForm = null;
  }
}
