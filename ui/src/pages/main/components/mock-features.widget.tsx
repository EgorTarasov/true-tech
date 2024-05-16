import { Card } from "@/ui/Card";
import { Section } from "./section.widget";
import { onNotImplemented } from "@/utils/not-implemented";
import CashbackIcon from "../assets/cashback.svg";
import HistoryIcon from "../assets/history.svg";
import LimitIcon from "../assets/limit.svg";
import ReferenceIcon from "../assets/reference.svg";
import PinIcon from "../assets/pin.svg";

export const MockFeatures = () => (
  <>
    <Section title="Кешбэк">
      <button
        className="block text-left w-full max-w-96"
        onClick={onNotImplemented}
        aria-label="МТС Кэшбэк. На счету: 130 руб.">
        <Card big className="gap-0">
          <h3 className="font-medium text-lg">MTS Cashback</h3>
          <div className="flex items-center rounded-lg bg-red py-0.5 px-3 text-white w-fit gap-1">
            <CashbackIcon /> 130 ₽
          </div>
        </Card>
      </button>
    </Section>
    <Section title="Ещё">
      <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4 w-full">
        <Card.Icon onClick={onNotImplemented} icon={<HistoryIcon />} text="История операций" />
        <Card.Icon onClick={onNotImplemented} icon={<LimitIcon />} text="Комиссия и лимиты" />
        <Card.Icon onClick={onNotImplemented} icon={<ReferenceIcon />} text="Справки и выписки" />
        <Card.Icon onClick={onNotImplemented} icon={<PinIcon />} text="Офисы и банкоматы" />
      </div>
    </Section>
  </>
);
