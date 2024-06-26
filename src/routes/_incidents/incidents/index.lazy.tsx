import { Text } from "@/components/typography/Text";
import { Button } from "@/components/ui/button";
import { IncidentsPageViewModel } from "@/widgets/incidents/incidents.page.vm";
import { createFileRoute } from "@tanstack/react-router";

const vm = IncidentsPageViewModel;

const Page = () => {
  return (
    <div className="flex items-center justify-center size-full pt-40 flex-col gap-10 appear">
      <Text.H3>Выберите объект из списка</Text.H3>
      <Button className="flex md:hidden" onClick={() => (vm.drawerOpen = true)}>
        Открыть список
      </Button>
    </div>
  );
};

export const Route = createFileRoute("/_incidents/incidents/")({
  component: Page,
});
