import { twMerge } from "tailwind-merge";

export const Separator = ({ className }: { className?: string }) => {
  return (
    <span
      role="none"
      className={twMerge("h-px min-h-[1px] w-full bg-text-primary/10", className)}
    />
  );
};
