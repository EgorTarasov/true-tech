import { MainPageViewModel } from "./main.vm";
import { observer } from "mobx-react-lite";
import { Card } from "@/ui/Card";
import PlusIcon from "@/assets/icons/plus.svg";
import TemplateIcon from "./assets/template.svg";
import { DialogBase } from "@/ui";
import { Section } from "./components/section.widget";
import BillIcon from "./assets/bill.svg";
import { useEffect, useState } from "react";
import { DynamicFormViewModel } from "@/components/dynamic-form/dynamic-form.vm";
import { DynamicForm } from "@/components/dynamic-form/dynamic-form.widget";
import { MockAside } from "./components/mock-aside.widget";
import { MockFeatures } from "./components/mock-features.widget";
import { BankCardForm } from "./components/forms/bank-card.form";
import { CreateForm } from "./components/forms/create.form";
import Loader from "@/ui/Loader";

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
    <div className="section pb-6 pt-6 sm:pt-20 min-h-full flex-col sm:flex-row flex gap-4 md:gap-16">
      <DialogBase
        title={vm.selectedCustomForm === "create-form" ? "Создание формы" : undefined}
        width={550}
        description={
          <div className="sr-only">
            Необходимо заполнить поля:{" "}
            {vm.selectedForm ? vm.selectedForm.form.fields.map((x) => x.label).join(", ") : ""}
            {vm.selectedCustomForm === "bank-form" && "Банковские реквизиты, телефон и сумму"}
            {vm.selectedCustomForm === "create-form" &&
              "Название услуги, поля форма или ссылка на форму на сайте мтс"}
          </div>
        }
        onCancel={hideForm}
        isOpen={!formHiding && isFormVisible}>
        {vm.selectedForm && <DynamicForm vm={vm.selectedForm} />}
        {vm.selectedCustomForm &&
          {
            "bank-form": <BankCardForm onSubmit={async (v) => console.log(v)} />,
            "create-form": <CreateForm vm={vm} />
          }[vm.selectedCustomForm]}
      </DialogBase>
      <MockAside vm={vm} />
      <div className="space-y-12 w-full">
        <Section title="Шаблоны и автоплатежи">
          {vm.isLoading ? (
            <Loader />
          ) : (
            <div className="flex flex-col md:grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4 w-full">
              <Card.Icon
                icon={<BillIcon />}
                text="Пополнить телефон"
                onClick={() => (vm.selectedCustomForm = "bank-form")}
              />
              {vm.forms.map((x) => (
                <Card.Icon
                  key={x.id}
                  icon={<TemplateIcon />}
                  text={x.name}
                  onClick={() => {
                    vm.selectedForm = new DynamicFormViewModel(x, {
                      onSubmit: (v) => vm.submitDynamicForm(v)
                    });
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
          )}
        </Section>
        <MockFeatures />
      </div>
    </div>
  );
});
