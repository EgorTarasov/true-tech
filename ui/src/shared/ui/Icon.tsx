import { FC, PropsWithChildren } from "react";

export const Icon: FC<PropsWithChildren> = (x) => {
  return (
    <div className="size-16 rounded-full flex items-center justify-center bg-stroke">
      {x.children}
    </div>
  );
};
