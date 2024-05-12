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
        value={formVm.name}
        onChange={(v) => (formVm.name = v)}
        placeholder="Новая услуга"
      />
      {vm.isLoading ? (
        <Loader />
      ) : (
        <DropdownMultiple
          value={formVm.selectedFields}
          render={(v) => v.label}
          onChange={(v) => (formVm.selectedFields = v)}
          options={formVm.fields}
          label="Выберите поля"
        />
      )}
      <div className="flex justify-between">
        <Button
          className="gap-2 ml-auto"
          onClick={() => formVm.createForm()}
          disabled={!formVm.formValid || !formVm.name.trim() || formVm.loading}>
          Создать
        </Button>
      </div>
    </div>
  );
});
