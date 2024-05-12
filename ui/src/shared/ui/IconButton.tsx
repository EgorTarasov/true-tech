import { FC, HTMLProps, ReactElement } from "react";
import { twMerge } from "tailwind-merge";

type IconButtonProps = Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "children"> & {
  icon: React.FC<HTMLProps<SVGElement>>;
};

export const IconButton: FC<IconButtonProps> = ({ className, icon: Icon, ...rest }) => {
  return (
    <button
      className={twMerge(
        "size-14 flex items-center justify-center text-text-primary/60 hover:text-text-primary transition-colors cursor-pointer rounded-full bg-stroke",
        className
      )}
      {...rest}>
      <Icon className="size-5" />
    </button>
  );
};
