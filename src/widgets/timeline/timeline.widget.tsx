import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { MapStore } from "@/stores/map.store";
import { cn } from "@/utils/cn";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { observer } from "mobx-react-lite";
import { ru } from "date-fns/locale";

const vm = MapStore;

export const TimelineWidget = observer(() => {
  return (
    <div className="grid gap-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-72 justify-start text-left font-normal bg-card",
              !vm.dateRange && "text-muted-foreground"
            )}>
            <CalendarIcon className="mr-2 h-4 w-4" />
            {vm.dateRange.from ? (
              vm.dateRange.to ? (
                <>
                  {format(vm.dateRange.from, "LLL dd, y", {
                    locale: ru
                  })}{" "}
                  -{" "}
                  {format(vm.dateRange.to, "LLL dd, y", {
                    locale: ru
                  })}
                </>
              ) : (
                format(vm.dateRange.from, "LLL dd, y", {
                  locale: ru
                })
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            highlightedDates={vm.datesWithEvents}
            mode="range"
            defaultMonth={vm.dateRange.from}
            selected={vm.dateRange}
            onSelect={(v) => {
              if (v) {
                vm.dateRange = v;
              }
            }}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
});
