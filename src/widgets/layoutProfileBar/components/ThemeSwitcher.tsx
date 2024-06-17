import { useTheme } from "@/components/hoc/theme-provider";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { MoonIcon, SunIcon } from "lucide-react";

export const ThemeSwitcher = () => {
  const theme = useTheme();

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="outline"
          className="bg-card"
          size="icon"
          onClick={() => theme.setTheme(theme.theme === "light" ? "dark" : "light")}>
          {theme.theme === "light" ? <SunIcon /> : <MoonIcon />}
        </Button>
      </TooltipTrigger>
      <TooltipContent>{theme.theme === "light" ? "Темная тема" : "Светлая тема"}</TooltipContent>
    </Tooltip>
  );
};
