import { makeAutoObservable } from "mobx";
import { QueryViewModel } from "./query.vm";

const sanitizeVoiceInput = (text: string) => {
  const str = text.replace(/(?<=\d)[ -](?=\d)/g, ""); // "12-34 56" -> "123456"

  return str;
};

class speechViewModel {
  constructor() {
    makeAutoObservable(this);
  }

  activeQuery: QueryViewModel | null = null;
  sessionId: string = crypto.randomUUID();

  search = "";
  updateSearch(search: string, append?: boolean) {
    if (append) {
      this.search += search;
    } else {
      this.search = search;
    }

    this.activeQuery = new QueryViewModel(sanitizeVoiceInput(this.search), this.sessionId, () => {
      this.sessionId = crypto.randomUUID();
      this.search = "";
    });
  }
}

export const SpeechService = new speechViewModel();
