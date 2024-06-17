import { AnimatedOutlet } from "@/components/router/animated-outlet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { IncidentsOverlay } from "@/widgets/incidents/incidents-overlay";
import { IncidentsSidebar, IncidentsSidebarMobile } from "@/widgets/incidents/incidents-sidebar";
import { IncidentsPageViewModel } from "@/widgets/incidents/incidents.page.vm";
import { Outlet, createFileRoute, useMatch, useMatches } from "@tanstack/react-router";
import { AnimatePresence } from "framer-motion";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";

const vm = IncidentsPageViewModel;

const Page = observer(() => {
  const matches = useMatches();
  const match = useMatch({ strict: false });
  const nextMatchIndex = matches.findIndex((d) => d.id === match.id) + 1;
  const nextMatch = matches[nextMatchIndex];

  return (
    <main className="size-full flex">
      <IncidentsSidebarMobile />
      <IncidentsSidebar />
      <ScrollArea className="flex-1 pt-[72px] pb-4 h-full">
        <Outlet />
      </ScrollArea>
    </main>
  );
});

export const Route = createFileRoute("/_base/_incidents")({
  component: Page
});
