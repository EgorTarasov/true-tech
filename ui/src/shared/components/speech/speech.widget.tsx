import { observer } from "mobx-react-lite";
import MicrophoneIcon from "@/assets/icons/microphone.svg";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import { useEffect, useMemo } from "react";
import { debounce } from "@/utils/debounce";
import { cn } from "@/utils/cn";
import { SpeechService } from "./speech.vm";
import { toast } from "sonner";
import { useLocation } from "react-router-dom";

export const SpeechWidget = observer(() => {
  const vm = SpeechService;
  const location = useLocation();

  const { transcript, listening, resetTranscript, browserSupportsSpeechRecognition } =
    useSpeechRecognition();
  const appendText = useMemo(
    () =>
      debounce((text: string) => {
        if (text.length === 0) return; // prevent first debounce

        vm.updateSearch(" " + text, true);
        resetTranscript();
      }, 2000),
    [vm, resetTranscript]
  );

  useEffect(() => {
    if (location.pathname === "/assistant") return;
    appendText(transcript);
    if (transcript.length === 0) return;

    toast(
      <div className="flex flex-col">
        <h3>Слушаем...</h3>
        <span aria-hidden="true" className="text-xs text-grey23">
          {transcript} transcript
        </span>
      </div>,
      {
        id: vm.sessionId
      }
    );
  }, [transcript, appendText, vm.sessionId, location.pathname]);

  if (!browserSupportsSpeechRecognition) return null;

  return (
    <section
      title="Голосовое управление"
      className="flex-1 justify-end flex items-center gap-2 pr-3">
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
        stroke-width="1"
        className={cn("size-5", listening ? "text-red" : "text-grey")}
      />
      <span className="sr-only">голосовое управление</span>
    </button>
  );
});
