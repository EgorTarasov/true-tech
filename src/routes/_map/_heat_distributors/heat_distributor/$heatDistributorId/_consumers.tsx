import { ConsumerCard } from "@/components/cards/consumer.card";
import { Text } from "@/components/typography/Text";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { LoadingWrapper } from "@/components/ui/loaders/LoadingWrapper";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { MapStore } from "@/stores/map.store";
import { MainSidebar } from "@/widgets/layoutMainSidebar/main-sidebar.widget";
import { PaginationWidget } from "@/widgets/pagination/pagination.widget";
import { Link, Outlet, createFileRoute, useMatches } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDownIcon } from "lucide-react";
import { observer } from "mobx-react-lite";
import React, { useEffect, useRef, useState } from "react";

const transitionProps = {
  initial: { opacity: 0, translateY: 20 },
  animate: { opacity: 1, translateY: 0 },
  exit: { opacity: 0, translateY: 20 }
};

const PriorityDropdown = observer(() => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant="outline" className="bg-card flex gap-2 w-56 text-left px-3 mx-4">
        <Text.Subtle className="flex-1">
          {MapStore.showPriorityFirst ? "Сначала приоритетные" : "Сначала остывшие"}
        </Text.Subtle>
        <ChevronDownIcon className="size-4 text-muted-foreground" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent className="w-56">
      <DropdownMenuItem onClick={() => (MapStore.showPriorityFirst = true)}>
        Сначала приоритетные
      </DropdownMenuItem>
      <DropdownMenuItem onClick={() => (MapStore.showPriorityFirst = false)}>
        Сначала остывшие
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
));

const PageBreadcrumbs = () => (
  <Breadcrumb className="px-4">
    <BreadcrumbList>
      <BreadcrumbItem>
        <Link to="/">Источники тепла</Link>
      </BreadcrumbItem>
      <BreadcrumbSeparator />
      <BreadcrumbItem>
        <BreadcrumbPage className="cursor-default">Потребители тепла</BreadcrumbPage>
      </BreadcrumbItem>
    </BreadcrumbList>
  </Breadcrumb>
);

const Page = observer(() => {
  const ref = useRef<HTMLDivElement>(null);
  const m = useMatches();
  const heatDistributorId = Route.useParams().heatDistributorId;
  // const heatSource = MapStore.heatSourceVm.items.find((v) => v.id.toString() === heatDistributorId);
  const vm = MapStore;

  useEffect(() => {
    if (ref.current) {
      ref.current.scrollTop = 0;
    }
  }, [vm.consumersPaged.currentPage]);

  return (
    <>
      <MainSidebar>
        <div className="gap-3 h-full overflow-hidden flex flex-col">
          <Text.UiMedium className="px-4 text-muted-foreground">Реестр объектов</Text.UiMedium>
          <PageBreadcrumbs />
          <PriorityDropdown />
          <ScrollArea ref={ref}>
            {vm.consumersPaged.paginatedItems.map((v) => (
              <React.Fragment key={v.id}>
                <Link
                  to="/heat_distributor/$heatDistributorId/consumers/$consumerId"
                  params={{
                    heatDistributorId,
                    consumerId: v.id.toString()
                  }}>
                  <ConsumerCard data={v} />
                </Link>
                <Separator />
              </React.Fragment>
            ))}
            {vm.consumersPaged.loading && <LoadingWrapper />}
          </ScrollArea>
          <AnimatePresence mode="popLayout" initial={false}>
            {vm.consumersPaged.totalPages > 1 && (
              <motion.div className="mt-auto mb-4" {...transitionProps}>
                <PaginationWidget
                  currentPage={vm.consumersPaged.currentPage}
                  onPageChange={(v) => vm.consumersPaged.setPage(v)}
                  totalPages={vm.consumersPaged.totalPages}
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

export const Route = createFileRoute(
  "/_map/_heat_distributors/heat_distributor/$heatDistributorId/_consumers"
)({
  component: Page
});
