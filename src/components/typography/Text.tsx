import { cn } from "@/utils/cn";
import { HTMLProps } from "react";

type keys =
  | "H4"
  | "H3"
  | "H2"
  | "Large"
  | "UiMedium"
  | "SubtleSemi"
  | "SubtleMedium"
  | "Subtle"
  | "Small"
  | "p"
  | "Detail"
  | "Error";

export const Text: Record<keys, (p: HTMLProps<HTMLHeadingElement>) => JSX.Element> = {
  H4: (p) => <h4 {...p} className={cn("text-xl font-semibold", p.className)}></h4>,
  H3: (p) => <h3 {...p} className={cn("text-2xl font-semibold", p.className)}></h3>,
  H2: (p) => <h2 {...p} className={cn("text-3xl font-semibold", p.className)}></h2>,
  Large: (p) => <h2 {...p} className={cn("text-lg font-medium", p.className)}></h2>,
  UiMedium: (p) => <p {...p} className={cn("text-base font-medium", p.className)}></p>,
  SubtleSemi: (p) => <p {...p} className={cn("text-sm font-semibold", p.className)}></p>,
  Subtle: (p) => <p {...p} className={cn("text-sm font-normal", p.className)}></p>,
  SubtleMedium: (p) => <p {...p} className={cn("text-sm font-medium", p.className)}></p>,
  Small: (p) => <p {...p} className={cn("text-sm leading-4 font-medium", p.className)}></p>,
  p: (p) => <p {...p} className={cn("text-base", p.className)}></p>,
  Detail: (p) => <p {...p} className={cn("text-xs leading-5 font-medium", p.className)}></p>,
  Error: (p) => <p {...p} className={cn("text-sm text-red-500 text-center", p.className)}></p>
};
