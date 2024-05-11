import { say } from "@/utils/say";
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

    say(this.message);

    // try {
    //   const res = await DetectionEndpoint.execute(this.message, this.sessionId);
    //   console.log(res);

    //   toast.loading("Выполняем действия", {
    //     id: this.sessionId
    //   });

    //   setTimeout(() => {
    //     toast.success("Команда успешно выполнена!", {
    //       id: this.sessionId
    //     });
    //   }, 2000);
    // } catch {
    //   toast.error("Ошибка выполнения команды", {
    //     id: this.sessionId
    //   });
    // }
    // this.onCompleted();
  }
}
