import { GrantsService } from "@/stores/grant.service";
import { MapLoading } from "@/widgets/map/map-loading";
import { Link, Outlet, createFileRoute, useNavigate } from "@tanstack/react-router";
import React, { Suspense, useEffect, useState } from "react";
import {
  SidebarContent,
  MainSidebarContext
} from "@/widgets/layoutMainSidebar/main-sidebar.context";
import { checkGrant } from "@/utils/check-grant";
import { Text } from "@/components/typography/Text";
import { ELEVATION } from "@/constants/elevation";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/utils/cn";
import { observer } from "mobx-react-lite";
import { MapStore } from "@/stores/map.store";

const MainSidebarView = React.lazy(() =>
  import("@/widgets/layoutMainSidebar/main-sidebar.view").then((x) => ({
    default: x.MainSidebarView
  }))
);
const Map = React.lazy(() => import("@/widgets/map/map.widget"));
const BottomRightBar = React.lazy(() =>
  import("@/widgets/layoutBottomRight/bottom-right-bar").then((x) => ({
    default: x.BottomRightBar
  }))
);

const ProfileBar = React.lazy(() =>
  import("@/widgets/layoutProfileBar/profile-bar.widget").then((m) => ({ default: m.ProfileBar }))
);

const Page = observer(() => {
  const navigate = useNavigate();
  const [content, _setContent] = useState<SidebarContent | null>(null);
  const [secondaryContent, setSecondaryContent] = useState<SidebarContent | null>(null);
  const [isOpen, setIsOpen] = useState(true);

  const setContent = (v: SidebarContent | null) => {
    setIsOpen(true);
    _setContent(v);
  };

  useEffect(() => {
    MapStore.navigateFn = navigate;
  }, []);

  return (
    <MainSidebarContext.Provider
      value={{
        isOpen,
        toggleSidebar: () => setIsOpen(!isOpen),
        content,
        setContent,
        secondaryContent,
        setSecondaryContent
      }}>
      <div className="h-full w-full relative appear">
        {/* <div
          className="flex md:hidden flex-col absolute inset-0 bg-background items-center justify-center text-center"
          style={{ zIndex: ELEVATION.NAVIGATE_INCIDENTS }}>
          <Text.H3>Карта доступна только с компьютера</Text.H3>
          <Link to="/incidents" className={cn(buttonVariants({ variant: "default" }), "mt-4")}>
            <Text.UiMedium>Перейти к инцидентам</Text.UiMedium>
          </Link>
        </div> */}
        <Suspense fallback={<MapLoading />}>
          <Map />
        </Suspense>
        <Outlet />
      </div>
      <Suspense fallback={null}>
        <MainSidebarView />
        <BottomRightBar />
        <ProfileBar />
      </Suspense>
    </MainSidebarContext.Provider>
  );
});

export const Route = createFileRoute("/_map")({
  component: Page,
  loader: () => {
    checkGrant(GrantsService.canReadMap);
  }
});
