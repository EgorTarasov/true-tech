import { Text } from "@/components/typography/Text";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { NotificationStore } from "@/stores/notification.store";
import { cn } from "@/utils/cn";
import { BellIcon } from "lucide-react";
import { observer } from "mobx-react-lite";
import { NotificationSort } from "./NotificationSort";
import { useEffect, useState } from "react";
import { NotificationCard } from "@/components/cards/notification.card";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const vm = NotificationStore;

export const NotificationWidget = observer(() => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (vm.notifications.length === 0) {
      setOpen(false);
    }
  }, [vm.notifications]);

  return (
    <>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button size="icon" variant="ghost" className="relative" onClick={() => setOpen(true)}>
            <BellIcon />
            {vm.notifications.length > 0 && (
              <div
                className={cn(
                  "absolute top-2 border border-card right-2 w-2 h-2 rounded-full bg-primary"
                )}
              />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>Уведомления</TooltipContent>
      </Tooltip>
      <Sheet open={open} onOpenChange={(v) => setOpen(v)}>
        <SheetContent className="flex flex-col gap-3 h-full overflow-hidden">
          <SheetHeader>
            <SheetTitle>Уведомления</SheetTitle>
          </SheetHeader>
          {vm.notifications.length > 0 && <NotificationSort />}
          <ScrollArea className="flex-1 space-y-2 flex flex-col gap-2">
            {vm.notifications.map((n) => (
              <NotificationCard
                key={n.id}
                data={n}
                onClose={() => {
                  vm.resolve(n);
                }}
              />
            ))}
            {vm.notifications.map((n) => (
              <NotificationCard
                key={n.id}
                data={n}
                onClose={() => {
                  vm.resolve(n);
                }}
              />
            ))}
            {vm.notifications.map((n) => (
              <NotificationCard
                key={n.id}
                data={n}
                onClose={() => {
                  vm.resolve(n);
                }}
              />
            ))}
            {vm.notifications.map((n) => (
              <NotificationCard
                key={n.id}
                data={n}
                onClose={() => {
                  vm.resolve(n);
                }}
              />
            ))}
            {vm.notifications.map((n) => (
              <NotificationCard
                key={n.id}
                data={n}
                onClose={() => {
                  vm.resolve(n);
                }}
              />
            ))}
            {vm.notifications.map((n) => (
              <NotificationCard
                key={n.id}
                data={n}
                onClose={() => {
                  vm.resolve(n);
                }}
              />
            ))}
            {vm.notifications.map((n) => (
              <NotificationCard
                key={n.id}
                data={n}
                onClose={() => {
                  vm.resolve(n);
                }}
              />
            ))}
            {vm.notifications.map((n) => (
              <NotificationCard
                key={n.id}
                data={n}
                onClose={() => {
                  vm.resolve(n);
                }}
              />
            ))}
            {vm.notifications.map((n) => (
              <NotificationCard
                key={n.id}
                data={n}
                onClose={() => {
                  vm.resolve(n);
                }}
              />
            ))}
            {vm.notifications.map((n) => (
              <NotificationCard
                key={n.id}
                data={n}
                onClose={() => {
                  vm.resolve(n);
                }}
              />
            ))}
            {vm.notifications.map((n) => (
              <NotificationCard
                key={n.id}
                data={n}
                onClose={() => {
                  vm.resolve(n);
                }}
              />
            ))}
            {vm.notifications.length === 0 && (
              <div className="flex flex-col gap-3 pt-6 text-center">
                <Text.p>Нет уведомлений</Text.p>
                <Text.Small className="text-muted-foreground">
                  На иконке будет индикатор, когда они появятся
                </Text.Small>
              </div>
            )}
          </ScrollArea>
        </SheetContent>
      </Sheet>
    </>
  );
});
