import { cn } from "@/utils/cn";
import { FC } from "react";

export const TitleInfo: FC<{ title: string; info: string; className?: string }> = (x) => (
  <li className={cn("text-sm gap-x-1 flex flex-wrap", x.className)}>
    <h4 className="font-medium">{x.title}:</h4>
    <p>{x.info}</p>
  </li>
);
