import DropdownMultiple from "@/components/DropdownMultiple";
import { Text } from "@/components/typography/Text";
import { Button } from "@/components/ui/button";
import { MapStore } from "@/stores/map.store";
import { observer } from "mobx-react-lite";

const vm = MapStore;

export const MainSidebarFilters = observer(() => {
  return (
    <div className="px-4 pb-4 gap-3 h-full overflow-auto flex flex-col">
      <Text.UiMedium className="text-muted-foreground">Фильтры</Text.UiMedium>
      <div className="space-y-3 flex-1">
        {vm.filters.map((f, i) => (
          <DropdownMultiple {...f.attributes} key={i} />
        ))}
      </div>
      <Button variant="secondary" onClick={() => vm.reset()}>
        Сбросить фильтры
      </Button>
    </div>
  );
});
