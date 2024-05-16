import { observer } from "mobx-react-lite";
import MicrophoneIcon from "@/assets/icons/microphone.svg";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import { useEffect, useMemo } from "react";
import { debounce } from "@/utils/debounce";
import { cn } from "@/utils/cn";
import { SpeechService } from "./speech.vm";
import { toast } from "sonner";
import { useLocation } from "react-router-dom";
import { AssistantStore } from "../../../pages/assistant/assistant.vm";

export const SpeechWidget = observer(() => {
  const vm = SpeechService;
  const location = useLocation();

  const { transcript, listening, resetTranscript, browserSupportsSpeechRecognition } =
    useSpeechRecognition();
  const appendText = useMemo(
    () =>
      debounce((text: string) => {
        if (text.length === 0) return; // prevent first debounce

        if (location.pathname === "/assistant") {
          const input = document.getElementById("assistant-input") as HTMLInputElement | null;
          if (input) {
            AssistantStore.message = text;
            AssistantStore.sendMessage();
            resetTranscript();
          }
          toast.success("Сообщение отправлено", { id: vm.sessionId });
          return;
        }
        vm.updateSearch(" " + text, true);
        resetTranscript();
      }, 2000),
    [vm, resetTranscript, location]
  );

  useEffect(() => {
    appendText(transcript);
    if (transcript.length === 0) return;

    toast(
      <div className="flex flex-col">
        <h3>Слушаем...</h3>
        <span aria-hidden="true" className="text-xs text-grey23">
          {transcript}
        </span>
      </div>,
      {
        id: vm.sessionId
      }
    );
  }, [transcript, appendText, vm.sessionId, location.pathname]);

  return browserSupportsSpeechRecognition ? (
    <section title="Голосовое управление" className="flex items-center gap-3">
      <p className="text-grey text-sm">
        <kbd className="text-xs">F3</kbd> - режим рации
      </p>
      <button
        className="h-fit"
        type="button"
        role="checkbox"
        aria-checked={listening}
        onClick={() => {
          if (listening) {
            SpeechRecognition.stopListening();
            return;
          }
          SpeechRecognition.startListening({ language: "ru-RU", continuous: true });
        }}>
        <MicrophoneIcon className={cn("size-6", listening ? "text-red" : "text-grey")} />
        <span className="sr-only">голосовое управление</span>
      </button>
    </section>
  ) : (
    <span className="sr-only">
      Браузер не поддерживает голосовое управление. Рекомендуем установить Google Chrome
    </span>
  );
});

export const SmallSpeechWidget = observer(() => {
  const { listening } = useSpeechRecognition();

  return (
    <button
      className="h-fit"
      type="button"
      role="checkbox"
      aria-checked={listening}
      onClick={() => {
        if (listening) {
          SpeechRecognition.stopListening();
          return;
        }
        SpeechRecognition.startListening({ language: "ru-RU", continuous: true });
      }}>
      <MicrophoneIcon
        strokeWidth="1"
        className={cn("size-5", listening ? "text-red" : "text-grey")}
      />
      <span className="sr-only">голосовое управление</span>
    </button>
  );
});
