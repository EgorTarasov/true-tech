import { Text } from "@/components/typography/Text";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { NotificationFilters, NotificationFiltersLocale } from "@/constants/notification-filters";
import { NotificationStore } from "@/stores/notification.store";
import { ChevronDownIcon } from "lucide-react";
import { observer } from "mobx-react-lite";

export const NotificationSort = observer(() => {
  const vm = NotificationStore;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="bg-card flex gap-2 w-72 text-left px-3">
          <span className="*:size-4">{NotificationFiltersLocale.Sort[vm.sort].icon}</span>

          <Text.Subtle className="flex-1">
            {NotificationFiltersLocale.Sort[vm.sort].locale}
          </Text.Subtle>
          <ChevronDownIcon className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-72">
        <DropdownMenuGroup>
          {Object.entries(NotificationFiltersLocale.Sort).map(([key, v], i) => (
            <DropdownMenuItem key={i} asChild>
              <Button
                variant="ghost"
                className="flex gap-2 w-full text-left"
                onClick={() => (vm.sort = key as NotificationFilters.Sort)}>
                <span className="*:size-4">{v.icon}</span>
                <Text.Subtle className="flex-1">{v.locale}</Text.Subtle>
              </Button>
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
});
