import { CSSProperties, ReactNode, createContext, useContext } from "react";

export interface SidebarContent {
  content: ReactNode;
  closeAction?: () => void;
}

interface MainSidebarContextProps {
  isOpen: boolean;
  toggleSidebar: () => void;
  content: SidebarContent | null;
  setContent: (v: SidebarContent | null) => void;
  secondaryContent: SidebarContent | null;
  setSecondaryContent: (v: SidebarContent | null) => void;
}

export const MainSidebarContext = createContext<MainSidebarContextProps | null>(null);

export const useSidebar = () => {
  const ctx = useContext(MainSidebarContext);

  if (!ctx) throw new Error("SidebarContext is not provided");

  return ctx;
};
