import { ScrollArea } from "@/components/ui/scroll-area";
import { IncidentsOverlay } from "@/widgets/incidents/incidents-overlay";
import {
  IncidentsSidebar,
  IncidentsSidebarMobile,
} from "@/widgets/incidents/incidents-sidebar";
import { IncidentsPageViewModel } from "@/widgets/incidents/incidents.page.vm";
import {
  Outlet,
  createFileRoute,
  useMatch,
  useMatches,
} from "@tanstack/react-router";
import { observer } from "mobx-react-lite";

const vm = IncidentsPageViewModel;

const Page = observer(() => {
  return (
    <main className="size-full flex">
      <IncidentsOverlay hasSidebar />
      <IncidentsSidebarMobile />
      <IncidentsSidebar />
      <ScrollArea className="flex-1 pt-[72px] pb-4 h-full">
        <Outlet />
      </ScrollArea>
    </main>
  );
});

export const Route = createFileRoute("/_incidents")({
  component: Page,
});
