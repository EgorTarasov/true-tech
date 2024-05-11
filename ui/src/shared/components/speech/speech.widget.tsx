import { observer } from "mobx-react-lite";
import MicrophoneIcon from "@/assets/icons/microphone.svg";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import { useEffect, useMemo } from "react";
import { debounce } from "@/utils/debounce";
import { cn } from "@/utils/cn";
import { SpeechService } from "./speech.vm";
import { toast } from "sonner";

export const SpeechWidget = observer(() => {
  const vm = SpeechService;

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
    appendText(transcript);
    if (transcript.length === 0) return;
    toast.loading(`Новый запрос: ${transcript}`, {
      id: vm.sessionId
    });
  }, [transcript, appendText, vm.sessionId]);

  if (!browserSupportsSpeechRecognition) return null;

  return (
    <section
      title="Голосовое управление"
      className="flex-1 justify-end flex items-center gap-2 pr-3">
      <button
        className="h-fit"
        type="button"
        onClick={() => {
          if (listening) {
            SpeechRecognition.stopListening();
            return;
          }
          SpeechRecognition.startListening({ language: "ru-RU", continuous: true });
        }}>
        <MicrophoneIcon className={cn("size-6", listening ? "text-red" : "text-grey")} />
        <span className="sr-only">включить голосовое управление</span>
      </button>
    </section>
  );
});
