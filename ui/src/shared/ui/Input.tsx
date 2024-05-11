import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  onChange?: (text: string) => void;
  error?: boolean;
  errorText?: string | null;
  allowClear?: boolean;
  rightIcon?: JSX.Element;
  rightIconIsButton?: boolean;
  leftIcon?: JSX.Element | false;
  onIconClick?: () => void;
  label?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      onChange,
      className,
      error,
      errorText,
      leftIcon,
      rightIcon,
      onIconClick,
      allowClear,
      label,
      ...rest
    },
    ref
  ) => (
    <div className={cn("w-full flex flex-col max-w-[600px]", className)}>
      {label && (
        <label
          className={cn("text-text-primary mb-2 text-sm", (error || errorText) && "text-error")}
          htmlFor={rest.id ?? rest.name}>
          {label}
        </label>
      )}
      <div className="w-full group flex relative items-center group">
        {leftIcon && <div className="absolute left-3">{leftIcon}</div>}
        <input
          ref={ref}
          className={cn(
            "w-full p-3 h-11",
            "outline-none transition-colors border-2 border-text-primary/20 group-hover:border-text-primary/60 focus:!border-link rounded-lg",
            (allowClear || rightIcon) && "pr-10",
            leftIcon && "pl-10",
            (error || errorText) && "border-error",
            rest.disabled
              ? "bg-text-primary/5 group-hover:bg-text-primary/5 text-text-primary/20"
              : ""
          )}
          onChange={(e) => onChange?.(e.target.value)}
          {...rest}
        />
        {allowClear && rest.value && !rest.disabled && (
          <button
            type="button"
            aria-label="Очистить поле ввода"
            className="absolute w-5 right-3 text-text-primary/60 hover:text-text-primary"
            onClick={() => onChange?.("")}>
            x
          </button>
        )}
        {rightIcon && !allowClear && (
          <button
            type={rest.rightIconIsButton ? "button" : undefined}
            onClick={onIconClick}
            aria-hidden={onIconClick ? undefined : true}
            aria-label="Отправить значение поля"
            className="absolute right-1 p-2 w-10 text-text-primary/60 hover:text-text-primary">
            {rightIcon}
          </button>
        )}
      </div>
      {errorText && <span className="text-error mt-1">{errorText}</span>}
    </div>
  )
);
