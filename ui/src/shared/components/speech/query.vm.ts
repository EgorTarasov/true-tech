import { DetectionEndpoint } from "api/endpoints/detection.endpoint";
import { makeAutoObservable } from "mobx";
import { toast } from "sonner";

export class QueryViewModel {
  constructor(
    private readonly message: string,
    private readonly sessionId: string,
    private onCompleted: () => void
  ) {
    makeAutoObservable(this);
    this.init();
  }

  private async init() {
    toast.loading("Обрабатываем запрос", {
      id: this.sessionId
    });

    try {
      const names: string[] = [];
      const fields = document.querySelectorAll("input[name]") as NodeListOf<HTMLInputElement>;
      fields.forEach((field) => field.name && names.push(field.name));

      const res = await DetectionEndpoint.execute(this.message, this.sessionId, names);

      toast.loading("Выполняем действия", {
        id: this.sessionId
      });

      Object.entries(res.content).forEach(([name, value]) => {
        if (value.length === 0) return;

        const input = document.querySelector(`input[name="${name}"]`) as HTMLInputElement | null;
        if (input) {
          input.value = value;
        }
      });

      toast.success("Команда успешно выполнена!", {
        id: this.sessionId
      });
    } catch {
      toast.error("Ошибка выполнения команды", {
        id: this.sessionId
      });
    }
    this.onCompleted();
  }
}
