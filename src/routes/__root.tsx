import { ThemeProvider } from "@/components/hoc/theme-provider";
import { LoadingWrapper } from "@/components/ui/loaders/LoadingWrapper";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ELEVATION } from "@/constants/elevation";
import NotFoundPage from "@/pages/not-found.page";
import { AuthService } from "@/stores/auth.service";
import { Outlet, createRootRoute } from "@tanstack/react-router";
import React from "react";

const Toaster = React.lazy(() =>
  import("@/components/ui/sonner").then((m) => ({ default: m.Toaster })),
);

const MobileNav = React.lazy(() =>
  import("@/widgets/layoutProfileBar/mobile-nav.widget").then((m) => ({
    default: m.MobileNav,
  })),
);

const Page = () => {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <TooltipProvider>
        <React.Suspense
          fallback={
            <div
              className="absolute inset-0 flex justify-center items-center"
              style={{ zIndex: ELEVATION.SIDEBAR }}
            >
              <LoadingWrapper />
            </div>
          }
        >
          <Outlet />
          <MobileNav />
          <Toaster richColors />
        </React.Suspense>
      </TooltipProvider>
    </ThemeProvider>
  );
};

export const Route = createRootRoute({
  component: Page,
  pendingComponent: LoadingWrapper,
  notFoundComponent: NotFoundPage,
  beforeLoad: () => AuthService.waitInit(),
});
