import { makeAutoObservable } from "mobx";
import { QueryViewModel } from "./query.vm";

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

    this.activeQuery = new QueryViewModel(
      this.search,
      this.sessionId,
      () => (this.sessionId = crypto.randomUUID())
    );
  }
}

export const SpeechService = new speechViewModel();
