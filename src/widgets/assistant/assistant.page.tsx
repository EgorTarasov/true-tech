import { observer } from "mobx-react-lite";
import { SendHorizonal } from "lucide-react";
import { IconInput } from "@/components/ui/input";
import { useState } from "react";
import { AssistantViewModel } from "./assistant.vm";

export const AssistantPage = observer(() => {
  const [vm] = useState(() => new AssistantViewModel("", () => {}));

  return (
    <>
      <div className="relative flex h-full w-full py-6 px-4 flex-col gap-4 mx-auto max-w-screen-desktop overflow-hidden max-w-[860px]">
        <div className="flex-1 flex flex-col-reverse overflow-y-auto h-full">
          <ul className="flex flex-col gap-3">
            {vm.messages.map((item, index) => (
              <li
                key={item?.id ?? index}
                aria-busy={!item.isUser && !item.last}
                aria-live="polite"
                className={`${item.isUser ? "justify-end" : "justify-start"} flex gap-2`}>
                <div
                  className={`p-5 flex flex-col rounded-2xl text-text-primary max-w-[70%]
                ${
                  item.isUser
                    ? "bg-primary/20 rounded-br-none"
                    : "bg-text-primary/5 rounded-bl-none border border-text-primary/5"
                }`}>
                  {item.message}
                  <ul className="space-y-1">
                    {!item.isUser &&
                      item.links?.map((link) => {
                        return (
                          <li key={link}>
                            <a
                              href={link}
                              target="_blank"
                              className="text-[#2c56de] underline underline-offset-4 flex gap-1"
                              rel="noreferrer">
                              {link}
                            </a>
                          </li>
                        );
                      })}
                  </ul>
                </div>
              </li>
            ))}
          </ul>
          {!vm.messages.length && (
            <div className="flex items-center bg-card rounded-2xl p-4 border border-text-primary/10">
              <div className="flex flex-col gap-2">
                <h2 className="font-semibold text-2xl">Привет! Чем могу помочь?</h2>
                <p className="text-text-primary/80">
                  Напишите свой вопрос о работе коммунальных служб и я постараюсь помочь вам.
                </p>
              </div>
            </div>
          )}
        </div>
        <form
          className="w-full min-h-fit"
          onSubmit={(e) => {
            e.preventDefault();
            vm.sendMessage();
          }}>
          <label id="hidden-label" htmlFor="assistant-input" className="sr-only">
            Введите ваш вопрос к ассистенту
          </label>
          <IconInput
            id="assistant-input"
            autoFocus
            className="w-full max-w-none"
            rightIcon={
              <button className="*:size-4 pointer-events-auto">
                <SendHorizonal aria-label="Отправить запрос" />
              </button>
            }
            placeholder="Введите ваш вопрос к ассистенту"
            aria-description="Для возврата к услугам нажмите клавишу Esc"
            disabled={vm.loading}
            value={vm.message}
            onChange={(v) => (vm.message = v.target.value)}
          />
        </form>
      </div>
    </>
  );
});
