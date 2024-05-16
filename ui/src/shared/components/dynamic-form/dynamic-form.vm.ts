import { FormDto } from "api/models/form.model";
import { makeAutoObservable } from "mobx";
import { toast } from "sonner";

type DynamicFormResult = [label: string, value: string];

export class DynamicFormViewModel {
  constructor(
    public form: FormDto.Item,
    public options: { onSubmit: (entries: DynamicFormResult[]) => void }
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
    const formValues: DynamicFormResult[] = [];
    Object.entries(this.fields).forEach(([key, value]) => {
      formValues.push([this.form.fields.find((x) => x.id === +key)!.label, value]);
    });

    setTimeout(() => {
      toast.success("Форма успешно отправлена", {
        description: `Заполненные поля: ${formValues
          .map(([label, value]) => `${label}: ${value}`)
          .join(", ")}`,
        important: true
      });
    }, 2000);

    this.options.onSubmit(formValues);
  }

  async onBankCardSubmit(values: FormDto.MobileTopUpTemplate) {
    console.log(values);
  }
}
