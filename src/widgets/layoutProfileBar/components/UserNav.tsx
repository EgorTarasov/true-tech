import { Text } from "@/components/typography/Text";
import { Button, buttonVariants } from "@/components/ui/button";
import { AuthService } from "@/stores/auth.service";
import { isLoggedIn } from "@/utils/auth";
import { Link, useNavigate } from "@tanstack/react-router";
import { BellIcon, Bot, HelpCircle, LogOutIcon, OctagonAlertIcon, PieChart } from "lucide-react";
import { observer } from "mobx-react-lite";
import { NotificationWidget } from "@/widgets/notification/notification.widget";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export const UserNav = observer(() => {
  const navigate = useNavigate();

  if (!isLoggedIn(AuthService.auth)) return null;

  const logout = () => {
    AuthService.logout();
    navigate({
      to: "/login"
    });
  };

  return (
    <div className="shadow py-2 px-3 bg-card text-card-foreground rounded-xl flex items-center gap-2">
      <NotificationWidget />
      <Tooltip>
        <TooltipTrigger asChild>
          <Link to="/incidents" className={buttonVariants({ variant: "ghost", size: "icon" })}>
            <OctagonAlertIcon />
          </Link>
        </TooltipTrigger>
        <TooltipContent>Инциденты</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link to="/reports" className={buttonVariants({ variant: "ghost", size: "icon" })}>
            <PieChart />
          </Link>
        </TooltipTrigger>
        <TooltipContent>Отчёты</TooltipContent>
      </Tooltip>
      {/* <Tooltip>
        <TooltipTrigger asChild>
          <Link
            to="/profile"
            className="size-10 flex shadow items-center justify-center rounded-full bg-accent text-accent-foreground">
            <Text.p>
              {[AuthService.auth.user.firstName ?? "К", AuthService.auth.user.lastName ?? "Д"]
                .map((name) => name[0].toUpperCase())
                .join("")}
            </Text.p>
          </Link>
          <Link to="/profile" className={buttonVariants({ variant: "ghost", size: "icon" })}>
            <HelpCircle />
          </Link>
        </TooltipTrigger>
        <TooltipContent>Помощник</TooltipContent>
      </Tooltip> */}
      <Tooltip>
        <TooltipTrigger asChild>
          <Button size="icon" variant="ghost" onClick={logout}>
            <LogOutIcon />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Выход</TooltipContent>
      </Tooltip>
    </div>
  );
});
