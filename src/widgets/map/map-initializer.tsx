import { observer } from "mobx-react-lite";
import { FC, useEffect, useRef } from "react";
import { useMap } from "react-leaflet";
import { MapStore } from "../../stores/map.store";
import { Map } from "leaflet";

export const MapInitializer: FC<{ setMap: (m: Map) => void }> = observer(
  (x) => {
    const map = useMap();
    const initialized = useRef(false);

    useEffect(() => {
      if (!initialized.current) {
        initialized.current = true;
        x.setMap(map);
      }
    }, [map]);

    return null;
  },
);
