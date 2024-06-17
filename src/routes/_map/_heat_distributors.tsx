import { HeatDistributorCard } from "@/components/cards/heat-distributor.card";
import { Text } from "@/components/typography/Text";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage
} from "@/components/ui/breadcrumb";
import { LoadingWrapper } from "@/components/ui/loaders/LoadingWrapper";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { MapStore } from "@/stores/map.store";
import { MainSidebar } from "@/widgets/layoutMainSidebar/main-sidebar.widget";
import { PaginationWidget } from "@/widgets/pagination/pagination.widget";
import { Link, Outlet, createFileRoute, useMatch, useMatches } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { observer } from "mobx-react-lite";
import React, { useEffect, useRef } from "react";

const vm = MapStore;
const transitionProps = {
  initial: { opacity: 0, translateY: 20 },
  animate: { opacity: 1, translateY: 0 },
  exit: { opacity: 0, translateY: 20 }
};

const Page = observer(() => {
  const ref = useRef<HTMLDivElement>(null);
  const m = useMatches();

  const isConsumersView = m.find((v) => v.pathname.includes("consumers")) !== undefined;

  useEffect(() => {
    if (ref.current) {
      ref.current.scrollTop = 0;
    }
  }, [vm.consumersPaged.currentPage]);

  if (isConsumersView) return <Outlet />;

  return (
    <>
      <MainSidebar>
        <div className="gap-3 h-full overflow-hidden flex flex-col">
          <Text.UiMedium className="px-4 text-muted-foreground">Реестр объектов</Text.UiMedium>
          <Breadcrumb className="px-4">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage>Источники тепла</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <ScrollArea ref={ref}>
            {vm.heatSourcesPaged.paginatedItems.map((v) => (
              <React.Fragment key={v.id}>
                <Link
                  to="/heat_distributor/$heatDistributorId"
                  params={{
                    heatDistributorId: v.id.toString()
                  }}>
                  <HeatDistributorCard data={v} />
                </Link>
                <Separator />
              </React.Fragment>
            ))}
            {vm.heatSourcesPaged.loading && <LoadingWrapper />}
          </ScrollArea>
          <AnimatePresence mode="popLayout" initial={false}>
            {vm.heatSourcesPaged.totalPages > 1 && (
              <motion.div className="mt-auto mb-4" {...transitionProps}>
                <PaginationWidget
                  currentPage={vm.heatSourcesPaged.currentPage}
                  onPageChange={(v) => vm.heatSourcesPaged.setPage(v)}
                  totalPages={vm.heatSourcesPaged.totalPages}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </MainSidebar>
      <Outlet />
    </>
  );
});

export const Route = createFileRoute("/_map/_heat_distributors")({
  component: Page
});
