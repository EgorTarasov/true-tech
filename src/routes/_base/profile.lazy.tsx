import { AssistantPage } from "@/widgets/assistant/assistant.page";
import { createFileRoute } from "@tanstack/react-router";

{
  /* <div className="w-full h-96 flex items-center justify-center text-2xl gap-8 mx-auto text-center flex-col">
  Тут будет информация о вашем профиле
  <Link
    to="/"
    className={buttonVariants({
      variant: "default"
    })}>
    Перейти на карту
  </Link>
</div> */
}
export const Route = createFileRoute("/_base/profile")({
  component: AssistantPage
});
