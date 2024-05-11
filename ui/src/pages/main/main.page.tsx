import { CustomFormType, MainPageViewModel } from "./main.vm";
import { observer } from "mobx-react-lite";
import { Card } from "@/ui/Card";
import PlusIcon from "@/assets/icons/plus.svg";
import RepeatIcon from "./assets/repeat.svg";
import { Button, DialogBase, IconButton } from "@/ui";
import { Section } from "./components/section.widget";
import { useEffect, useState } from "react";
import { DynamicFormViewModel } from "@/components/dynamic-form/dynamic-form.vm";
import { DynamicForm } from "@/components/dynamic-form/dynamic-form.widget";
import { MockAside } from "./components/mock-aside.widget";
import { MockFeatures } from "./components/mock-features.widget";
import { BankCardForm } from "./components/forms/bank-card.form";
import HistoryIcon from "./assets/history.svg";
import { CreateForm } from "./components/forms/create.form";

export const MainPage = observer(() => {
  const [vm] = useState(() => new MainPageViewModel());
  const [formHiding, setFormHiding] = useState(false);
  const isFormVisible = !!vm.selectedForm || vm.selectedCustomForm !== null;

  const hideForm = () => {
    setFormHiding(true);
    setTimeout(() => {
      vm.selectedForm = null;
      vm.selectedCustomForm = null;
      setFormHiding(false);
    }, 300);
  };

  useEffect(() => {
    if (isFormVisible) {
      setFormHiding(false);
    }
  }, [vm.selectedForm, vm.selectedCustomForm]);

  return (
    <div className="section pb-6 pt-20 min-h-full flex gap-16">
      <DialogBase
        title={vm.selectedCustomForm === "create-form" ? "Создание формы" : undefined}
        width={550}
        onCancel={hideForm}
        isOpen={!formHiding && isFormVisible}>
        {vm.selectedForm && <DynamicForm vm={vm.selectedForm} />}
        {vm.selectedCustomForm &&
          {
            "bank-form": <BankCardForm onSubmit={async (v) => console.log(v)} />,
            "create-form": <CreateForm vm={vm} />
          }[vm.selectedCustomForm]}
      </DialogBase>
      <MockAside />
      <div className="space-y-12 w-full">
        <Section title="Шаблоны и автоплатежи">
          <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4 w-full">
            <Card.Icon
              icon={<HistoryIcon />}
              text="Перевести деньги"
              onClick={() => (vm.selectedCustomForm = "create-form")}
            />
            {vm.forms.map((x) => (
              <Card.Icon
                key={x.id}
                icon={<RepeatIcon />}
                text={x.name}
                onClick={() => {
                  vm.selectedForm = new DynamicFormViewModel(x);
                  vm.selectedCustomForm = null;
                }}
              />
            ))}
            <Card.Icon
              icon={<PlusIcon />}
              text="Создать новый"
              onClick={() => (vm.selectedCustomForm = "create-form")}
              className="bg-grey4"
            />
          </div>
        </Section>
        <MockFeatures />
      </div>
    </div>
  );
});
