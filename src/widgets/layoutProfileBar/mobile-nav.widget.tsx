import { useTheme } from "@/components/hoc/theme-provider";
import { Text } from "@/components/typography/Text";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ELEVATION } from "@/constants/elevation";
import { AuthService } from "@/stores/auth.service";
import { isLoggedIn } from "@/utils/auth";
import { cn } from "@/utils/cn";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import {
  Link,
  useMatch,
  useMatchRoute,
  useMatches,
  useNavigate,
} from "@tanstack/react-router";
import { FileRoutesByPath } from "@tanstack/react-router";
import {
  LogOutIcon,
  MapIcon,
  MoonIcon,
  OctagonAlertIcon,
  PieChart,
  SunIcon,
} from "lucide-react";
import { observer } from "mobx-react-lite";
import { ReactNode, useMemo } from "react";

const pages = [
  ["/", "Карта", <MapIcon />],
  ["/incidents/", "Инциденты", <OctagonAlertIcon />],
  ["/reports", "Отчёты", <PieChart />],
] as const;

export const MobileNav = observer(() => {
  const page = useMatches();
  const navigate = useNavigate();
  const theme = useTheme();

  const activePage = useMemo(
    () =>
      pages.reduce((acc, v) => {
        if (page.some((p) => p.pathname === v[0])) {
          return v;
        }
        return acc;
      }),
    [page],
  );

  if (!isLoggedIn(AuthService.auth)) return null;

  const logout = () => {
    AuthService.logout();
    navigate({
      to: "/login",
    });
  };

  return (
    <div
      className="flex lg:hidden gap-2 absolute top-4 right-4"
      style={{ zIndex: ELEVATION.PROFILE }}
    >
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="lg"
            className="bg-card flex gap-2 w-72 text-left px-3"
          >
            <span className="*:size-4">{activePage[2]}</span>
            <Text.Subtle className="flex-1">{activePage[1]}</Text.Subtle>
            <ChevronDownIcon className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-72">
          <DropdownMenuGroup>
            {pages.map(([link, name, icon], i) => (
              <DropdownMenuItem key={i} asChild>
                <Link
                  to={link}
                  className={cn(
                    buttonVariants({ variant: "ghost" }),
                    "flex gap-2 w-full text-left dark:opacity-80",
                  )}
                >
                  <span className="*:size-4">{icon}</span>
                  <Text.Subtle className="flex-1">{name}</Text.Subtle>
                </Link>
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem asChild>
              <Button
                variant="ghost"
                className="w-full text-left justify-start gap-2 text-sm font-normal px-4 text-popover-foreground/90"
                onClick={() =>
                  theme.setTheme(theme.theme === "light" ? "dark" : "light")
                }
              >
                {theme.theme === "light" ? (
                  <>
                    <SunIcon className="size-4" />
                    Светлая тема
                  </>
                ) : (
                  <>
                    <MoonIcon className="size-4" />
                    Тёмная тема
                  </>
                )}
              </Button>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />

          <DropdownMenuGroup>
            <DropdownMenuItem asChild>
              <Button
                variant="ghost"
                onClick={logout}
                className="w-full text-left justify-start gap-2 text-sm font-normal px-4 text-popover-foreground/90"
              >
                <LogOutIcon className="size-4 pl-[1px]" />
                Выход
              </Button>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
});
