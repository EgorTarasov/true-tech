import { ELEVATION } from "@/constants/elevation";
import { observer } from "mobx-react-lite";
import { ThemeSwitcher } from "../layoutProfileBar/components/ThemeSwitcher";
import { UserNav } from "../layoutProfileBar/components/UserNav";
import { Link } from "@tanstack/react-router";
import { buttonVariants } from "@/components/ui/button";
import { ChevronLeftIcon } from "lucide-react";
import { FC } from "react";
import { cn } from "@/utils/cn";
import { isLoggedIn } from "@/utils/auth";
import { AuthService } from "@/stores/auth.service";

export const IncidentsOverlay: FC<{ hasSidebar?: boolean }> = observer((x) => {
  return (
    <>
      <div
        className={cn(
          "absolute top-4 md:left-4 lg:ml-4 flex pointer-events-none",
          x.hasSidebar && "md:left-96",
        )}
        style={{ zIndex: ELEVATION.FILTERS }}
      >
        {isLoggedIn(AuthService.auth) && (
          <Link
            to="/"
            className={cn(
              buttonVariants({ variant: "secondary" }),
              "hidden md:flex pointer-events-auto",
            )}
          >
            <ChevronLeftIcon className="hidden lg:flex" />
            <p className="flex lg:hidden">Карта</p>
            <p className="hidden lg:flex">Вернуться к карте</p>
          </Link>
        )}
      </div>
      <div
        className="absolute top-4 right-4 hidden lg:flex gap-2"
        style={{ zIndex: ELEVATION.FILTERS }}
      >
        <div className="flex gap-2">
          <ThemeSwitcher />
          <UserNav />
        </div>
      </div>
    </>
  );
});
