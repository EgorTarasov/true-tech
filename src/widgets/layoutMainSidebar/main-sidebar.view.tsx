import { observer } from "mobx-react-lite";
import { useSidebar } from "./main-sidebar.context";
import { twMerge } from "tailwind-merge";
import { ELEVATION } from "@/constants/elevation";
import { cn } from "@/utils/cn";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  CrossIcon,
  FilterIcon,
  ListIcon,
  MenuIcon,
  SearchIcon,
  XIcon,
} from "lucide-react";
import { FC, useCallback, useEffect, useState } from "react";
import { IconInput, Input } from "@/components/ui/input";
import { MainSidebarFilters } from "./filters";
import { AnimatePresence } from "framer-motion";
import { useIsPresent, motion } from "framer-motion";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { throttle } from "@/utils/debounce";
import { SecondarySidebarView } from "./SecondarySidebar/secondary-sidebar.view";
import { MapStore } from "@/stores/map.store";
import { useIsMobile } from "@/utils/use-is-mobile";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { ScrollArea } from "@/components/ui/scroll-area";

const transitionProps = {
  initial: { opacity: 0, translateY: 20 },
  animate: { opacity: 1, translateY: 0 },
  exit: { opacity: 0, translateY: 20 },
};

export const MainSidebarViewDesktop = observer(() => {
  const [filtersOpen, _setFiltersOpen] = useState(false);
  const isMobile = useIsMobile();
  const ctx = useSidebar();

  const setFiltersOpen = useCallback(
    throttle((v: boolean) => {
      _setFiltersOpen(v);
    }, 350),
    [],
  );

  return (
    <>
      <SecondarySidebarView />
      <div
        className="flex absolute gap-2 top-4 left-4 w-[412px]"
        style={{ zIndex: ELEVATION.SEARCHBAR }}
      >
        <IconInput
          containerClassName="flex-1"
          className={ctx.isOpen ? "bg-background shadow-none" : "bg-card"}
          rightIcon={<SearchIcon />}
          value={MapStore.search}
          onChange={(v) => (MapStore.search = v.target.value)}
          placeholder="Введите unom"
        />
        <Button
          onClick={() => {
            if (filtersOpen) {
              setFiltersOpen(false);
            } else {
              if (!ctx.isOpen) {
                ctx.toggleSidebar();
              }
            }
            setFiltersOpen(!filtersOpen);
          }}
          variant={filtersOpen ? "destructive" : "outline"}
          size="icon"
          className={cn(
            filtersOpen ? "bg-destructive" : "bg-card",
            ctx.isOpen ? "shadow-none" : "shadow-sm",
          )}
        >
          {filtersOpen ? <XIcon /> : <FilterIcon />}
        </Button>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="ml-4 bg-card"
              onClick={() => {
                if (filtersOpen) {
                  setFiltersOpen(false);
                }
                ctx.toggleSidebar();
              }}
            >
              <ChevronLeft className={cn(!ctx.isOpen && "rotate-180")} />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">
            {ctx.isOpen ? "Скрыть" : "Показать"} боковую панель
          </TooltipContent>
        </Tooltip>
      </div>
      <aside
        className={cn(
          "absolute transition-transform flex left-0 bottom-0 top-0 translate-x-0 overflow-hidden",
          !ctx.isOpen && !filtersOpen && "-translate-x-96",
        )}
        style={{ zIndex: ELEVATION.SIDEBAR }}
      >
        <div className="w-96 flex h-full bg-card text-card-foreground shadow-md pt-[72px] *:w-full">
          <AnimatePresence mode="popLayout" initial={false}>
            {filtersOpen ? (
              <motion.div key="filters" {...transitionProps}>
                <MainSidebarFilters />
              </motion.div>
            ) : (
              <motion.div key="content" {...transitionProps}>
                {ctx.content?.content}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </aside>
    </>
  );
});

export const MainSidebarViewMobile = observer(() => {
  const [filtersOpen, setFiltersOpen] = useState(false);
  const ctx = useSidebar();

  return (
    <>
      <div
        className="flex absolute gap-2 top-4 left-4 right-4"
        style={{ zIndex: ELEVATION.SEARCHBAR }}
      >
        <Drawer
          open={ctx.isOpen}
          onOpenChange={(v) => {
            if (!v) {
              setFiltersOpen(false);
            }
            if (v === ctx.isOpen) {
              return;
            }

            ctx.toggleSidebar();
          }}
        >
          <DrawerTrigger asChild>
            <Button size="lg" className="px-4 gap-2">
              <ListIcon className="size-4" />
            </Button>
          </DrawerTrigger>
          <DrawerContent className="h-[80vh] overflow-hidden text-foreground">
            <aside
              className={cn("flex overflow-hidden h-full flex-col")}
              style={{ zIndex: ELEVATION.SIDEBAR }}
            >
              <div className="p-4 flex gap-3 w-full">
                <Button
                  onClick={() => {
                    if (filtersOpen) {
                      setFiltersOpen(false);
                    } else {
                      if (!ctx.isOpen) {
                        ctx.toggleSidebar();
                      }
                    }
                    setFiltersOpen(!filtersOpen);
                  }}
                  variant={filtersOpen ? "destructive" : "outline"}
                  size="icon"
                  className={cn(
                    filtersOpen && "bg-destructive",
                    ctx.isOpen ? "shadow-none" : "shadow-sm",
                  )}
                >
                  {filtersOpen ? <XIcon /> : <FilterIcon />}
                </Button>
                <IconInput
                  containerClassName="flex-1"
                  className="bg-background"
                  rightIcon={<SearchIcon />}
                  value={MapStore.search}
                  onChange={(v) => (MapStore.search = v.target.value)}
                  placeholder="Введите unom"
                />
              </div>
              <div className="flex flex-1 text-card-foreground *:w-full overflow-auto">
                <AnimatePresence mode="popLayout" initial={false}>
                  {filtersOpen ? (
                    <motion.div key="filters" {...transitionProps}>
                      <MainSidebarFilters />
                    </motion.div>
                  ) : ctx.secondaryContent ? (
                    <motion.div key="secondary" {...transitionProps}>
                      {ctx.secondaryContent.closeAction && (
                        <div className="flex ml-4 pb-2">
                          <Button
                            variant="secondary"
                            size="default"
                            className="pl-2"
                            onClick={() =>
                              ctx.secondaryContent?.closeAction?.()
                            }
                          >
                            <ChevronLeft />
                            Назад
                          </Button>
                        </div>
                      )}
                      <ScrollArea>{ctx.secondaryContent.content}</ScrollArea>
                    </motion.div>
                  ) : (
                    <motion.div key="content" {...transitionProps}>
                      {ctx.content?.content}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </aside>
          </DrawerContent>
        </Drawer>
      </div>
    </>
  );
});

export const MainSidebarView = observer(() => {
  const isMobile = useIsMobile();

  if (isMobile) return <MainSidebarViewMobile />;

  return <MainSidebarViewDesktop />;
});
