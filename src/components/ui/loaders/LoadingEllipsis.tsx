import { CSSProperties, FC } from "react";
import cl from "./LoadingEllipsis.module.css";
import { cn } from "@/utils/cn";

const LoadingEllipsis: FC<{ size?: number; className?: string }> = ({ size, className }) => {
  return (
    <div
      className={cn(cl.ldsEllipsis, "*:bg-primary", className)}
      style={{ "--size": `${size ?? 80}px` } as CSSProperties}>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  );
};

export default LoadingEllipsis;
