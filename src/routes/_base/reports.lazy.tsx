import { Text } from "@/components/typography/Text";
import { createFileRoute } from "@tanstack/react-router";
import { observer } from "mobx-react-lite";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button, buttonVariants } from "@/components/ui/button";
import { ChevronDownIcon, PlusIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
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

// export function TableDemo() {
//   return (
//     <Table>
//       <TableHeader>
//         <TableRow className="*:whitespace-nowrap">
//           <TableHead className="w-full">Название файла</TableHead>
//           <TableHead>Дата добавления</TableHead>
//           <TableHead>Действия с файлом</TableHead>
//         </TableRow>
//       </TableHeader>
//       <TableBody>
//         {invoices.map((invoice) => (
//           <TableRow key={invoice.invoice}>
//             <TableCell>{invoice.invoice}</TableCell>
//             <TableCell>{invoice.paymentStatus}</TableCell>
//             <TableCell>{invoice.paymentMethod}</TableCell>
//           </TableRow>
//         ))}
//       </TableBody>
//     </Table>
//   );
// }

const Page = observer(() => {
  const [district, setDistrict] = useState("Восточный административный округ");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // const getReport = async () => {
    //   const res = await FileEndpoint.predict(
    //     "Восточный административный округ",
    //     "06-06-2024",
    //     "06-06-2025",
    //   );
    //   console.log(res);
    // };
    // getReport();
  }, []);
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
          <CardContent>
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
          </CardContent>
          <CardFooter>
            <Button className="ml-auto">Составить отчёт</Button>
          </CardFooter>
        </Card>
        <Text.H4>Составить отчет</Text.H4>
        <Text.H4>Загруженные данные</Text.H4>
        <ScrollArea className="flex-1 pt-4">
          {/* <TableDemo /> */}
          <div className="flex pt-4">
            <div className={cn(buttonVariants({}), "relative ml-auto")}>
              <input type="file" className="opacity-0 absolute inset-0" />
              <PlusIcon />
              <span>Загрузить файл</span>
            </div>
          </div>
          <div className="pb-8" />
        </ScrollArea>
      </main>
    </>
  );
});

export const Route = createFileRoute("/_base/reports")({
  component: Page,
});
