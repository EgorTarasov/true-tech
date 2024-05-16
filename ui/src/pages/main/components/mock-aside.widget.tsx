import { Card } from "@/ui/Card";
import { onNotImplemented } from "@/utils/not-implemented";
import PlusIcon from "@/assets/icons/plus.svg";
import { Button, IconButton } from "@/ui";
import { observer } from "mobx-react-lite";
import React, { FC } from "react";
import { FCVM } from "@/utils/fcvm";
import { MainPageViewModel } from "../main.vm";
import MirIcon from "@/assets/icons/mir.svg";

export const MockAside: FCVM<MainPageViewModel> = observer(({ vm }) => (
  <aside className="space-y-3 min-w-80 sm:max-w-80 w-full">
    <Card disablePadding title="Карты">
      <div className="px-6">
        <h4>Мой кошелек</h4>
        <p className="text-xl font-medium">15 ₽</p>
      </div>
      <Card.Separator />
      <ul className="w-full flex flex-col gap-1" title="Мои банковские карты">
        {vm.cards.map((v, i) => (
          <React.Fragment key={i}>
            <li className="w-full px-2 pb-3">
              <button
                className="px-4 py-3 w-full flex text-left rounded-lg hover:bg-bg2 cursor-pointer items-center"
                aria-label={`Карта #${i + 1}. Последние 4 цифры: ${v.cardNumber
                  .toString()
                  .slice(-4)
                  .split("")
                  .join(" ")}`}
                onClick={onNotImplemented}>
                <div className="flex flex-col gap-1">
                  <h5>
                    <span className="capitalize">{v.name}</span> карта
                  </h5>
                  <p>···· ···· ···· {v.cardNumber.toString().slice(-4)}</p>
                </div>
                <div className="flex bg-bg2 rounded-md ml-auto items-center justify-center px-1 py-2 h-fit">
                  <MirIcon alt="Логотип системы мир" />
                </div>
              </button>
            </li>
            <Card.Separator />
          </React.Fragment>
        ))}
      </ul>
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
));
