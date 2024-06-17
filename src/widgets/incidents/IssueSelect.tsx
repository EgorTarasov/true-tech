import { Issue, IssueLocaleMap } from "@/types/issue.type";
import { observer } from "mobx-react-lite";
import { FC } from "react";
import { Text } from "@/components/typography/Text";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { ChevronDownIcon } from "lucide-react";

export const IssueSelect: FC<{
  value: Issue | null;
  onChange?: (value: Issue | null) => void;
}> = observer(({ value, onChange }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="bg-card flex gap-2 w-72 text-left px-3">
          {value && <span className="*:size-4">{IssueLocaleMap[value].icon}</span>}

          <Text.Subtle className="flex-1">
            {value ? IssueLocaleMap[value].locale : "Все типы инцидентов"}
          </Text.Subtle>
          <ChevronDownIcon className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-72">
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Button
              variant="ghost"
              className="flex gap-2 w-full text-left"
              onClick={() => onChange?.(null)}>
              <Text.Subtle className="flex-1">Все типы инцидентов</Text.Subtle>
            </Button>
          </DropdownMenuItem>
          {[IssueLocaleMap.PREDICTION, IssueLocaleMap.EMERGENCY].map((v, i) => (
            <DropdownMenuItem key={i} asChild>
              <Button
                variant="ghost"
                className="flex gap-2 w-full text-left dark:opacity-80"
                style={{ color: v.color }}
                onClick={() =>
                  onChange?.(v.color === "#EF4444" ? Issue.EMERGENCY : Issue.PREDICTION)
                }>
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
