import { FormDto } from "api/models/form.model";
import { makeAutoObservable } from "mobx";

export class DynamicFormViewModel {
  constructor(
    public form: FormDto.Item,
    public options?: { onSubmit?: () => void }
  ) {
    makeAutoObservable(this);
  }

  fields: Record<number, string> = {};

  setField = (id: number, value: string) => {
    this.fields[id] = value;
  };

  getFieldValue = (id: number) => this.fields[id];

  get isValid() {
    return Object.values(this.fields).every((x) => !!x);
  }

  async onSubmit() {
    const formValues = Object.fromEntries(
      Object.entries(this.fields).map(([key, value]) => [key, value])
    );

    console.log(formValues);
  }

  async onBankCardSubmit(values: FormDto.MobileTopUpTemplate) {
    console.log(values);
  }
}
