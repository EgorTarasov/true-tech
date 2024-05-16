import { observer } from "mobx-react-lite";
import { MainPageViewModel } from "../../main.vm";
import { FCVM } from "@/utils/fcvm";
import { useState } from "react";
import { CreateFormViewModel } from "./create.form.vm";
import { Button, Input } from "@/ui";
import DropdownMultiple from "@/ui/DropdownMultiple";
import Loader from "@/ui/Loader";

export const CreateForm: FCVM<MainPageViewModel> = observer(({ vm }) => {
  const [formVm] = useState(() => new CreateFormViewModel(vm));

  return (
    <div className="flex flex-col gap-8">
      <Input
        label="Название услуги"
        id="service-name"
        value={formVm.name}
        onChange={(v) => (formVm.name = v)}
        placeholder="Новая услуга"
      />
      {vm.isLoading ? (
        <Loader />
      ) : (
        <DropdownMultiple
          value={formVm.selectedFields}
          compare={(v) => v.label}
          render={(v) => (
            <div className="flex flex-col">
              <span>{v.label} </span>
              <span className="text-xs text-grey23" title="">
                <span className="sr-only">
                  ,
                  <br />
                  Кодовый ключ для поля: ,
                </span>
                {v.name}
              </span>
            </div>
          )}
          onChange={(v) => (formVm.selectedFields = v)}
          options={formVm.fields}
          label="Выберите поля"
        />
      )}
      <div className="flex gap-2 items-center w-full">
        <span className="border border-grey4 flex-1" />
        <h4>или</h4>
        <span className="border border-grey4 flex-1" />
      </div>
      <Input
        label="Ссылка на форму"
        id="form-url"
        placeholder="https://mts.ru/myform"
        value={formVm.formUrl}
        onChange={(v) => (formVm.formUrl = v)}
      />
      <div className="flex justify-between">
        <Button
          className="gap-2 ml-auto"
          onClick={() => formVm.createForm()}
          disabled={
            formVm.loading ||
            (formVm.formUrl.trim().length === 0 && (!formVm.formValid || !formVm.name.trim()))
          }>
          Создать
        </Button>
      </div>
    </div>
  );
});
