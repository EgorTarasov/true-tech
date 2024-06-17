import { cn } from "@/utils/cn";
import { DetailedHTMLProps, FC } from "react";

export const IncidentCardWrapper: FC<
  DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>
> = ({ className, ...props }) => (
  <div className={cn("px-5 py-3 bg-card rounded-2xl border flex flex-col", className)} {...props} />
);
