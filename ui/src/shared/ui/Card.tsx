import { FC, PropsWithChildren, ReactNode, useEffect, useId, useRef, useState } from "react";
import { twMerge } from "tailwind-merge";
import ChevronIcon from "@/assets/icons/chevron.svg";

interface Props extends PropsWithChildren {
  className?: string;
  title?: string;
  disablePadding?: boolean;
  big?: boolean;
}

const CardBase: FC<Props> = (x) => {
  const ref = useRef<HTMLDivElement>(null);
  const id = useId();
  const [collapse, setCollapse] = useState(false);
  const [collapseFinished, setCollapseFinished] = useState(false);

  useEffect(() => {
    if (!ref.current) return;

    const toggleHeight = () => {
      ref.current!.style.setProperty(
        "height",
        collapse ? "72px" : `${ref.current!.scrollHeight}px`
      );
      setCollapseFinished(false);
      if (collapse) {
        setTimeout(() => setCollapseFinished(true), 150);
      }
    };

    const resizeObserver = new ResizeObserver(toggleHeight);
    const mutationObserver = new MutationObserver(toggleHeight);

    resizeObserver.observe(ref.current);
    mutationObserver.observe(ref.current, { childList: true });

    return () => {
      resizeObserver.disconnect();
      mutationObserver.disconnect();
    };
  }, [collapse]);

  return (
    <div
      ref={ref}
      className={twMerge(
        "flex flex-col gap-4 p-6 bg-white rounded-[28px] transition-all overflow-hidden",
        x.big && "p-8",
        x.disablePadding && `p-0 ${x.big ? "py-8" : "py-6"}`,
        x.className
      )}>
      {x.title && (
        <button
          aria-label={`${collapse ? "Развернуть" : "Свернуть"} секцию: ${x.title}`}
          aria-controls={id}
          aria-expanded={!collapse}
          className={twMerge(
            "flex text-xl font-medium items-center justify-between gap-2 pb-2",
            x.disablePadding && `${x.big ? "px-8" : "px-6"}`
          )}
          onClick={() => setCollapse(!collapse)}>
          <span>{x.title}</span>
          <ChevronIcon aria-hidden="true" className={twMerge("size-4", collapse && "rotate-180")} />
        </button>
      )}
      <div className={twMerge("flex flex-col gap-[inherit]")} id={id} aria-hidden={collapse}>
        {!collapseFinished && x.children}
      </div>
    </div>
  );
};

interface IconCardProps {
  className?: string;
  icon: ReactNode;
  text: string;
  onClick?: () => void;
}

const Icon: FC<IconCardProps> = (x) => {
  return (
    <button
      className={twMerge("text-black space-y-5 rounded-[28px] p-8 bg-white", x.className)}
      onClick={x.onClick}>
      <div
        className="size-16 flex items-center justify-center *:size-5 rounded-full bg-stroke"
        aria-hidden>
        {x.icon}
      </div>
      <span className="text-black block text-left text-lg font-normal">{x.text}</span>
    </button>
  );
};

const Separator = () => <div className="border-t border-border-primary" />;

export const Card = Object.assign(CardBase, {
  Icon,
  Separator
});
