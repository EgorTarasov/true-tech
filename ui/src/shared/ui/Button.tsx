import { twMerge } from "tailwind-merge";
import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  appearance?: "primary" | "outline";
}

export const Button: React.FC<ButtonProps> = ({ className, appearance = "primary", ...rest }) => {
  return (
    <button
      className={twMerge(
        "h-10 rounded-lg py-4 px-6 transition-all flex items-center justify-center cursor-pointer",
        appearance === "primary"
          ? "bg-primary hover:brightness-110 text-onPrimary"
          : "border border-primary hover:bg-primary/10 text-primary",
        rest.disabled &&
          (appearance === "primary"
            ? "bg-text-primary/20 hover:bg-button-disabled text-text-primary"
            : "!text-text-primary/20 !border-text-primary/5"),
        className
      )}
      {...rest}
    />
  );
};
