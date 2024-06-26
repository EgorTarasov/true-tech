import { Text } from "@/components/typography/Text";
import { createFileRoute } from "@tanstack/react-router";
import { observer } from "mobx-react-lite";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Button, buttonVariants } from "@/components/ui/button";
import { CalendarIcon, ChevronDownIcon, PlusIcon } from "lucide-react";
import { cn } from "@/utils/cn";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useEffect, useState } from "react";
import { FileEndpoint } from "@/api/endpoints/file.endpoint";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { DateRange } from "react-day-picker";
import { Calendar } from "@/components/ui/calendar";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";

/*
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="bg-card flex gap-2 text-left px-3 w-96"
                >
                  <Text.Subtle className="flex-1">{district}</Text.Subtle>
                  <ChevronDownIcon className="size-4 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-96">
                <DropdownMenuGroup>
                  {[
                    "Восточный административный округ",
                    "Западный административный округ",
                    "Зеленоградский административный округ",
                    "Новомосковский административный округ",
                    "Северный административный округ",
                    "Северо-Восточный административный округ",
                    "Северо-Западный административный округ",
                    "Троицкий административный округ",
                    "Центральный административный округ",
                    "Юго-Восточный административный округ",
                    "Юго-Западный административный округ",
                    "Южный административный округ",
                  ].map((item) => (
                    <DropdownMenuItem
                      key={item}
                      onClick={() => setDistrict(item)}
                    >
                      {item}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
*/

const Page = observer(() => {
  const [title, setTitle] = useState("");
  const [dateRange, setDateRange] = useState<DateRange>({
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    to: new Date(),
  });
  const [loading, setLoading] = useState(false);

  const getReport = async () => {
    if (!dateRange.from || !dateRange.to) {
      toast.error("Выберите промежуток дат");
      return;
    }

    if (title.trim() === "") {
      toast.error("Введите название отчёта");
      return;
    }

    setLoading(true);
    const dateFrom = format(dateRange.from, "dd-MM-yyyy");
    const dateTo = format(dateRange.to, "dd-MM-yyyy");
    try {
      const res = await FileEndpoint.create(title, dateFrom, dateTo);

      let success = false;
      while (!success) {
        const result = await FileEndpoint.getResult(res);
        if (result.downloadUrl) {
          // download and assign title
          const link = document.createElement("a");
          link.href = result.downloadUrl;
          link.download = `${title}.xlsx`;
          link.click();
          success = true;
          toast.success("Отчёт успешно сгенерирован");
          break;
        }
        await new Promise((r) => setTimeout(r, 1000));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <main className="mx-auto flex flex-col w-full max-w-screen-md pt-20 h-full overflow-hidden px-4">
        <Card>
          <CardHeader>
            <CardTitle>Составить отчёт</CardTitle>
            <CardDescription>
              Укажите округ и промежуток дат для генерации отчёта
            </CardDescription>
          </CardHeader>
          <CardContent className="gap-3 flex flex-wrap">
            <Input
              value={title}
              className="flex-1"
              onChange={(v) => setTitle(v.target.value)}
              placeholder="Название"
            />
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="date"
                  variant={"outline"}
                  className={cn(
                    "flex-1 justify-start text-left font-normal bg-card",
                    !dateRange && "text-muted-foreground",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRange.from ? (
                    dateRange.to ? (
                      <>
                        {format(dateRange.from, "LLL dd, y", {
                          locale: ru,
                        })}{" "}
                        -{" "}
                        {format(dateRange.to, "LLL dd, y", {
                          locale: ru,
                        })}
                      </>
                    ) : (
                      format(dateRange.from, "LLL dd, y", {
                        locale: ru,
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
                  highlightedDates={[new Date()]}
                  mode="range"
                  defaultMonth={dateRange.from}
                  selected={dateRange}
                  onSelect={(v) => {
                    if (v) {
                      setDateRange(v);
                    }
                  }}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
          </CardContent>
          <CardFooter>
            <Button className="ml-auto" disabled={loading} onClick={getReport}>
              Составить отчёт
            </Button>
          </CardFooter>
        </Card>
      </main>
    </>
  );
});

export const Route = createFileRoute("/_base/reports")({
  component: Page,
});
