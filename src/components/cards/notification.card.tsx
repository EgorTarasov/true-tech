import { Notification } from "@/types/notification.type";
import { FC } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { Button } from "../ui/button";
import { Clock4Icon, XIcon } from "lucide-react";
import { Text } from "../typography/Text";
import { getTimeDifference } from "@/utils/time";
import { PriorityLocaleMap } from "@/types/priority.type";

export const NotificationCard: FC<{ data: Notification; onClose: () => void }> = (x) => {
  return (
    <li className="mb-2 p-4 pt-2 border space-y-2 list-none bg-card text-card-foreground rounded-md relative">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={x.onClose}
            className="ml-auto size-7 absolute p-1.5 right-0 top-0 hover:bg-transparent">
            <XIcon />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Скрыть уведомление</TooltipContent>
      </Tooltip>
      <Text.UiMedium>{x.data.title}</Text.UiMedium>
      <Text.p>{x.data.description}</Text.p>
      <div className="flex items-center gap-2">
        <div
          className="border px-2 rounded-full"
          style={{
            color: PriorityLocaleMap[x.data.priority].color,
            backgroundColor: PriorityLocaleMap[x.data.priority].backgroundColor
          }}>
          <Text.Detail>{PriorityLocaleMap[x.data.priority].alternateLocale} важность</Text.Detail>
        </div>
        <div className="gap-1 flex items-center text-muted-foreground">
          <Clock4Icon className="size-4" />
          <p className="text-xs">{getTimeDifference(x.data.date)}</p>
        </div>
      </div>
    </li>
  );
};
