import { ELEVATION } from "@/constants/elevation";
import { observer } from "mobx-react-lite";
import { UserNav } from "./components/UserNav";
import { ThemeSwitcher } from "./components/ThemeSwitcher";
import { LayerSelect } from "./components/LayerSelect";
import { TimelineWidget } from "../timeline/timeline.widget";
import { MapStore } from "@/stores/map.store";

export const ProfileBar = observer(() => {
  return (
    <div
      className="absolute top-4 right-4 hidden gap-2 flex-col lg:flex-row items-end lg:items-start pointer-events-none lg:flex"
      style={{ zIndex: ELEVATION.PROFILE }}
    >
      <div className="hidden md:flex xl:flex-row gap-2 flex-col pointer-events-auto">
        <TimelineWidget />
        <LayerSelect
          value={MapStore.layer}
          onChange={(v) => (MapStore.layer = v)}
        />
      </div>
      <div className="flex gap-2 pointer-events-auto">
        <ThemeSwitcher />
        <UserNav />
      </div>
    </div>
  );
});
