import { MainPageStore } from "./main.vm";
import { observer } from "mobx-react-lite";
import { Card } from "@/ui/Card";
import PlusIcon from "@/assets/icons/plus.svg";
import BillIcon from "./assets/bill.svg";
import TemplateIcon from "./assets/template.svg";
import RepeatIcon from "./assets/repeat.svg";
import CashbackIcon from "./assets/cashback.svg";
import HistoryIcon from "./assets/history.svg";
import LimitIcon from "./assets/limit.svg";
import ReferenceIcon from "./assets/reference.svg";
import PinIcon from "./assets/pin.svg";
import { Button, IconButton } from "@/ui";
import { Section } from "./components/section.widget";
import { Link } from "react-router-dom";

export const MainPage = observer(() => {
  const vm = MainPageStore;

  return (
    <div className="section pb-6 pt-20 min-h-full flex gap-16">
      <aside className="space-y-3 min-w-80 max-w-80">
        <Card disablePadding title="Карты">
          <div className="px-6">
            <h4>Мой кошелек</h4>
            <p className="text-xl font-medium">15 ₽</p>
          </div>
          <Card.Separator />
          <button className="text-left px-6">
            Привязать карту другого
            <br /> банка
          </button>
        </Card>
        <Card title="Кредиты">
          <div className="m-auto">
            <IconButton aria-label="" icon={PlusIcon} />
          </div>
        </Card>
        <span className="block h-2" />
        <Button className="w-full">Открыть новый продукт</Button>
      </aside>
      <div className="space-y-12 w-full">
        <Section title="Шаблоны и автоплатежи">
          <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4 w-full">
            <Card.Icon icon={<BillIcon />} text="Счета на оплату" />
            <Card.Icon icon={<TemplateIcon />} text="Шаблоны" />
            <Card.Icon icon={<RepeatIcon />} text="Автоплатежи" />
            <Card.Icon icon={<PlusIcon />} text="Создать новый" className="bg-grey4" />
          </div>
        </Section>
        <Section title="Кешбэк">
          <Link to="/" className="block">
            <Card big className="w-96 gap-0">
              <h3 className="font-medium text-lg">MTS Cashback</h3>
              <div className="flex items-center rounded-lg bg-red py-0.5 px-3 text-white w-fit gap-1">
                <CashbackIcon /> 0 ₽
              </div>
            </Card>
          </Link>
        </Section>
        <Section title="Ещё">
          <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4 w-full">
            <Card.Icon icon={<HistoryIcon />} text="История операций" />
            <Card.Icon icon={<LimitIcon />} text="Комиссия и лимиты" />
            <Card.Icon icon={<ReferenceIcon />} text="Справки и выписки" />
            <Card.Icon icon={<PinIcon />} text="Офисы и банкоматы" />
          </div>
        </Section>
      </div>
    </div>
  );
});
