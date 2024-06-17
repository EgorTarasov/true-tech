import { Separator } from "@/components/ui/separator";
import { cn } from "@/utils/cn";
import { FC, PropsWithChildren, ReactNode } from "react";

export const Section: FC<
  PropsWithChildren & { className?: string; title?: ReactNode; withoutSeparator?: boolean }
> = (x) => (
  <>
    {x.withoutSeparator ? null : <Separator />}
    <section className={cn("px-4 py-3 pt-2 flex flex-col", x.className)}>
      {x.title && (
        <div className="h-9 flex items-center font-medium w-full justify-between">{x.title}</div>
      )}
      {x.children}
    </section>
  </>
);
