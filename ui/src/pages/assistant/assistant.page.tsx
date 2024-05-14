import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { AssistantViewModel } from "./assistant.vm";
import { observer } from "mobx-react-lite";
import { Input } from "@/ui";
import { SendHorizonal } from "lucide-react";
import { useSpeechRecognition } from "react-speech-recognition";
import { debounce } from "@/utils/debounce";
import PdfIcon from "./pdf.svg";

export const AssistantPage = observer(() => {
  const location = useLocation();
  const message = location.state?.message;
  const [vm] = useState(() => new AssistantViewModel(message ?? ""));
  const { transcript, resetTranscript } = useSpeechRecognition();
  const appendText = useMemo(
    () =>
      debounce((text: string) => {
        if (text.length === 0) return; // prevent first debounce

        vm.message = text;
      }, 300),
    [vm]
  );

  useEffect(() => {
    return () => resetTranscript();
  }, [resetTranscript]);

  const onSpeech = useMemo(
    () =>
      debounce(() => {
        vm.sendMessage();
        resetTranscript();
      }, 4000),
    [resetTranscript, vm]
  );

  useEffect(() => {
    if (vm.loading) {
      resetTranscript();
    }
    appendText(transcript);
    if (transcript.length > 0) {
      onSpeech();
    }
  }, [transcript, appendText, vm.loading, onSpeech]);
  console.log(transcript);

  return (
    <div className="relative flex h-full w-full py-6 px-4 flex-col gap-4 mx-auto max-w-screen-desktop overflow-hidden max-w-[860px]">
      <div className="flex-1 flex flex-col-reverse overflow-y-auto h-full">
        <ul className="flex flex-col gap-3">
          {vm.messages.map((item, index) => (
            <li
              key={index}
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
                      const hasStupidCharachters = link.includes("й");

                      return (
                        <li key={link}>
                          {hasStupidCharachters ? (
                            <p
                              className="text-[#2c56de] underline underline-offset-4"
                              rel="noreferrer">
                              {link}
                            </p>
                          ) : (
                            <a
                              href={link}
                              target="_blank"
                              className="text-[#2c56de] underline underline-offset-4 flex gap-1"
                              rel="noreferrer">
                              {link}
                            </a>
                          )}
                        </li>
                      );
                    })}
                </ul>
              </div>
            </li>
          ))}
        </ul>
        {!vm.messages.length && (
          <div className="flex items-center bg-white rounded-2xl p-4 border border-text-primary/20">
            <div className="flex flex-col gap-2">
              <h2 className="font-semibold text-2xl">Привет! Чем могу помочь?</h2>
              <p className="text-text-primary/80">
                Напишите свой вопрос о МТС и я постараюсь помочь вам.
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
        <Input
          className="w-full max-w-none"
          rightIcon={<SendHorizonal />}
          placeholder="Введите вопрос"
          disabled={vm.loading}
          aria-label="Введите ваш вопрос здесь"
          value={vm.message}
          onChange={(v) => (vm.message = v)}
        />
      </form>
    </div>
  );
});
