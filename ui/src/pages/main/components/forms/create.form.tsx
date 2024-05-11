import { observer } from "mobx-react-lite";
import { MainPageViewModel } from "../../main.vm";
import { FCVM } from "@/utils/fcvm";
import { useEffect, useRef, useState } from "react";
import { CreateFormViewModel } from "./create.form.vm";
import PlusIcon from "@/assets/icons/plus.svg";
import { Button, IconButton, Input } from "@/ui";
import { FormDto } from "api/models/form.model";
import DeleteIcon from "@/assets/icons/delete.svg";

const Field = observer(
  ({
    item,
    index,
    onDelete
  }: {
    item: FormDto.TemplateField;
    index: number;
    onDelete: () => void;
  }) => {
    const ref = useRef<HTMLInputElement>(null);

    useEffect(() => {
      ref.current?.focus();
      ref.current?.scrollIntoView({ behavior: "smooth" });
    }, [index]);

    return (
      <li className="flex flex-col bg-bg rounded-2xl p-6">
        <div className="flex justify-between items-center pb-2">
          <h4 className="font-bold text-lg">Поле {index + 1}</h4>
          <button className="p-2 rounded-full hover:bg-white" onClick={() => onDelete()}>
            <DeleteIcon className="size-5" />
          </button>
        </div>
        <Input label="Название" ref={ref} value={item.label} onChange={(v) => (item.label = v)} />
        <div className="flex gap-4 pt-3">
          <Input
            label="Тип"
            value={item.type}
            onChange={(v) => (item.type = v)}
            defaultValue="text"
            placeholder="password, text, email"
          />
          <Input
            label="Подсказка"
            value={item.placeholder}
            onChange={(v) => (item.placeholder = v)}
            placeholder="Необязательно"
          />
        </div>
      </li>
    );
  }
);

export const CreateForm: FCVM<MainPageViewModel> = observer(({ vm }) => {
  const [formVm] = useState(() => new CreateFormViewModel(vm));

  return (
    <div className="flex flex-col gap-8">
      <Input
        label="Название услуги"
        value={formVm.name}
        onChange={(v) => (formVm.name = v)}
        placeholder="Новая услуга"
      />
      <ol className="flex flex-col max-h-[500px] overflow-auto gap-4">
        {formVm.fields.map((x, i) => (
          <Field key={i} item={x} index={i} onDelete={() => formVm.deleteField(i)} />
        ))}
      </ol>
      <div className="flex justify-between">
        <Button className="gap-2 mr-auto" onClick={() => formVm.createField()} appearance="outline">
          <PlusIcon className="size-4" />
          <span>Новое поле</span>
        </Button>
        <Button className="gap-2 ml-auto" onClick={() => formVm.createForm()}>
          Создать
        </Button>
      </div>
    </div>
  );
});
