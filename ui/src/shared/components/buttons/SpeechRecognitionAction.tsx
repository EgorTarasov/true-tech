import { Button } from "@/ui";
import SpeechRecognition from "react-speech-recognition";

export const SpeechRecognitionAction = () => {
  return (
    <button
      className="px-2 text-nowrap"
      onClick={() => SpeechRecognition.startListening({ language: "ru-RU", continuous: true })}>
      Включить <span className="sr-only">голосовое управление</span>
    </button>
  );
};
