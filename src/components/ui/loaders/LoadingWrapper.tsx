import { FC } from "react";
import LoadingEllipsis from "./LoadingEllipsis";
import { cn } from "@/utils/cn";

export const LoadingWrapper: FC<{ className?: string }> = (x) => {
  return (
    <div className={cn("flex justify-center items-center h-full min-h-60", x.className)}>
      <LoadingEllipsis />
    </div>
  );
};
