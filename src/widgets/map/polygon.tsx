import { MapStore } from "@/stores/map.store";
import { Consumer } from "@/types/consumer.type";
import { PriorityLocaleMap } from "@/types/priority.type";
import { LatLngBounds, LatLngBoundsLiteral, LatLngExpression } from "leaflet";
import { observer } from "mobx-react-lite";
import { FC, useEffect } from "react";
import { Marker, Polygon, Popup, useMap } from "react-leaflet";

export const ConsumerPolygon: FC<{ data: Consumer.Polygon; noPadding?: boolean; color?: string }> =
  observer((x) => {
    const map = useMap();

    useEffect(() => {
      if (map) {
        const bounds = x.data.position as LatLngBoundsLiteral;
        map.fitBounds(bounds, {
          maxZoom: 17,
          animate: true,
          paddingTopLeft: [x.noPadding ? 0 : 300, 0]
        });
      }
    }, [x.data, map]);

    return (
      <>
        <Polygon positions={x.data.position as LatLngExpression[]} color={x.color ?? "#16A34A"} />
        {/* <Marker position={getTopLeftCorner() as LatLngExpression}>
        <Popup>Polygon {x.data.id}</Popup>
      </Marker> */}
      </>
    );
  });
