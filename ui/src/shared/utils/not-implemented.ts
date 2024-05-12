import { toast } from "sonner";

let secondTime = false;

export const onNotImplemented = () => {
  toast.info("Функционал в разработке", {
    description: secondTime ? "Воспользуйтесь секцией шаблоны и автоплатежи" : undefined
  });
  if (!secondTime) secondTime = true;
};
