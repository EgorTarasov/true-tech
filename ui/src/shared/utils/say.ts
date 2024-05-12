export const say = (text: string) => {
  const utterance = new SpeechSynthesisUtterance(text);

  const voices = speechSynthesis.getVoices();
  utterance.lang = "ru-RU";
  utterance.voice = voices[0];

  speechSynthesis.speak(utterance);
};
