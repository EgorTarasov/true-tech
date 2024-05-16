import { Button, Input } from "@/ui";
import { FormEvent, useState } from "react";
import { observer } from "mobx-react-lite";
import { DynamicFormViewModel } from "./dynamic-form.vm";
import headerImage from "@/assets/images/header.png";

export const DynamicForm = observer((x: { vm: DynamicFormViewModel }) => {
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);
    try {
      await x.vm.onSubmit();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full overflow-auto flex flex-col items-center">
      <div className="flex items-center gap-8 w-full pb-10">
        <img
          className="max-w-[200px] max-h-[80px] h-auto object-contain"
          src={x.vm.form.imgSrc ?? headerImage}
          alt="form"
        />
        <h1 className="text-2xl font-bold">{x.vm.form.name}</h1>
      </div>
      <form onSubmit={onSubmit} className="w-full flex flex-col gap-2">
        {x.vm.form.fields.map((field, index) => (
          <Input
            key={index}
            disabled={loading}
            className="w-full max-w-none"
            label={field.label}
            id={field.id.toString()}
            name={field.name.toString()}
            spellCheck={field.spellcheck}
            inputMode={field.inputmode || undefined}
            placeholder={field.placeholder}
            onChange={(v) => x.vm.setField(field.id, v)}
            value={x.vm.getFieldValue(field.id)}
            allowClear
            type={field.type}
          />
        ))}
        <div className="h-6" />
        <div className="flex justify-between">
          <p className="max-w-[320px]">
            Нажимая на кнопку Отправить, вы соглашаетесь с{" "}
            <a
              href="https://static.mts.ru/upload/images/Oferta_MTS_Apple.html"
              target="_blank"
              className="text-link"
              aria-label="Договор оферты"
              rel="noreferrer">
              Договором оферты
            </a>
          </p>
          <Button type="submit" disabled={loading}>
            Отправить
          </Button>
        </div>
      </form>
    </div>
  );
});
