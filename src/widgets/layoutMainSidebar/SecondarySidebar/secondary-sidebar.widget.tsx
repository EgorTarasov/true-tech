import React, { FC, ReactElement, useContext, useEffect } from "react";
import { MainSidebarContext, SidebarContent } from "../main-sidebar.context";

interface Props extends Omit<SidebarContent, "content"> {
  children: ReactElement;
}

export const SecondarySidebar: FC<Props> = (x) => {
  const ctx = useContext(MainSidebarContext);

  useEffect(() => {
    if (ctx) {
      ctx.setSecondaryContent({
        ...x,
        content: React.cloneElement(x.children)
      });

      return () => ctx.setSecondaryContent(null);
    }
  }, [x.children]);

  return null;
};
