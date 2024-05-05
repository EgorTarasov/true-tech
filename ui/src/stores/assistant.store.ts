import { makeAutoObservable } from "mobx";

interface MessageItem {
  id: number;
  message: string;
  isUser: boolean;
  links?: string[];
}

interface MessageEvent {
  query_id: number;
  text?: string;
  metadata?: string[];
  last?: boolean;
}

export class AssistantViewModel {
  constructor(public message: string) {
    makeAutoObservable(this);

    // let uuid = localStorage.getItem("uuid");
    // if (!uuid) {
    //   uuid = crypto.randomUUID();
    //   localStorage.setItem("uuid", uuid);
    // }
    void this.init();
  }

  async init() {
    const userId = crypto.randomUUID();

    this.ws = new WebSocket(
      `${import.meta.env.VITE_SOCKET_URL}/${crypto.randomUUID()}?user_id=${userId}`
    );

    this.ws.addEventListener("open", () => {
      if (this.message) {
        this.sendMessage();
      }
    });
    this.ws.addEventListener("message", (data) => {
      const message = JSON.parse(data.data) as MessageEvent;
      this.receiveMessage(message);
    });
  }

  loading = false;

  ws: WebSocket | null = null;

  messages: MessageItem[] = [];
  sendMessage = () => {
    if (this.loading || !this.message.trim().length) return;

    this.messages.push({ message: this.message, isUser: true, id: Math.random() });
    this.ws?.send(JSON.stringify({ text: this.message }));
    this.message = "";
    this.loading = true;
  };

  receiveMessage = (message: MessageEvent) => {
    const prevMessage = this.messages.find((x) => x.id === message.query_id);
    if (prevMessage) {
      if (message.last) {
        prevMessage.links = message.metadata;
      }
      prevMessage.message += message.text;
    } else {
      this.messages.push({ message: message.text ?? "", isUser: false, id: message.query_id });
    }
    if (message.last) {
      this.loading = false;
    }
  };
}
