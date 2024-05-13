import { Card } from "@/ui/Card";
import { onNotImplemented } from "@/utils/not-implemented";
import PlusIcon from "@/assets/icons/plus.svg";
import { Button, IconButton } from "@/ui";

export const MockAside = () => (
  <aside className="space-y-3 min-w-80 sm:max-w-80 w-full">
    <Card disablePadding title="Карты">
      <div className="px-6">
        <h4>Мой кошелек</h4>
        <p className="text-xl font-medium">15 ₽</p>
      </div>
      <Card.Separator />
      <button className="text-left px-6" onClick={onNotImplemented}>
        Привязать карту другого
        <br /> банка
      </button>
    </Card>
    <Card title="Кредиты">
      <div className="m-auto">
        <IconButton onClick={onNotImplemented} aria-label="Новый кредит" icon={PlusIcon} />
      </div>
    </Card>
    <span className="block h-2" />
    <Button className="w-full" onClick={onNotImplemented}>
      Открыть новый продукт
    </Button>
  </aside>
);
