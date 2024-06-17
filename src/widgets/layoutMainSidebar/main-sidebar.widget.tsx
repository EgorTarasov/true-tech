import React, { FC, ReactElement, useContext, useEffect } from "react";
import { SidebarContent, MainSidebarContext } from "./main-sidebar.context";
import { ReactNode } from "@tanstack/react-router";

interface Props extends Omit<SidebarContent, "content"> {
  children: ReactElement;
}

export const MainSidebar: FC<Props> = (x) => {
  const ctx = useContext(MainSidebarContext);

  useEffect(() => {
    if (ctx) {
      ctx.setContent({
        content: React.cloneElement(x.children)
      });
    }

    return () => ctx?.setContent(null);
  }, [x.children]);

  return null;
};
