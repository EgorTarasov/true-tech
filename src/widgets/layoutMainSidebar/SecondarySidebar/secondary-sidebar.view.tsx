import { ELEVATION } from "@/constants/elevation";
import { useSidebar } from "../main-sidebar.context";
import { motion } from "framer-motion";
import { AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { XIcon } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FC } from "react";

const transitionProps = {
  initial: { opacity: 0, translateX: -20 },
  animate: { opacity: 1, translateX: 0 },
  exit: { opacity: 0, translateX: -20 }
};

export const SecondarySidebarView = () => {
  const ctx = useSidebar();

  return (
    <AnimatePresence mode="popLayout" initial={false}>
      {ctx.isOpen && ctx.secondaryContent && (
        <motion.div
          {...transitionProps}
          className="absolute flex flex-col left-[392px] top-24 bottom-12 w-96 overflow-hidden pointer-events-none rounded-2xl"
          style={{ zIndex: ELEVATION.SIDEBAR }}>
          <div className="flex flex-col bg-card w-full shadow-lg rounded-2xl pb-6 pointer-events-auto overflow-hidden">
            {ctx.secondaryContent.closeAction && (
              <div className="flex justify-end">
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:bg-transparent text-muted-foreground"
                  onClick={() => ctx.secondaryContent?.closeAction?.()}>
                  <XIcon />
                </Button>
              </div>
            )}
            <ScrollArea>{ctx.secondaryContent.content}</ScrollArea>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
