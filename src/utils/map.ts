import { MapDto } from "@/api/models/map.model";
import { MapConstants } from "@/constants/map";
import { FeatureCollection } from "geojson";
import L from "leaflet";
import "leaflet.vectorgrid";

export const buildPropertyFeature = (
  v: MapDto.Property,
): MapConstants.PolygonFeature | null => {
  const coords = v.consumer_full_address.border?.find(
    (p) => p.Key === "coordinates",
  )?.Value as number[][][] | undefined;
  if (coords) {
    return {
      type: "Feature",
      geometry: {
        type: "Polygon",
        coordinates: [coords[0].map((v) => [v[0], v[1]] as [number, number])],
      },
      properties: {
        type: "consumer",
        data: {
          balance_holder: v.balance_holder,
          commissioning_date: v.commissioning_date,
          heating_point_location_type: v.heating_point_location_type,
          heating_point_number: v.heating_point_number,
          heating_point_src: v.heating_point_src,
          heating_point_type: v.heating_point_type,
          municipal_district: v.municipal_district,
          consumerAddress: {
            address: v.consumer_full_address.address,
            center: {
              coordinates: v.consumer_full_address.center.coordinates,
              type: v.consumer_full_address.center.type,
            },
            municipalDistrict: v.consumer_full_address.municipalDistrict,
            unom: v.consumer_full_address.unom,
          },
          consumers: [],
          heatingPointAddress: {
            address: v.heating_point_full_address.address,
            municipalDistrict: v.heating_point_full_address.municipalDistrict,
            unom: v.heating_point_full_address.unom,
            center: {
              type: "Point",
              coordinates: v.heating_point_full_address.center.coordinates as [
                number,
                number,
              ],
            },
          },
          priority: v.priority,
        },
      },
    };
  }

  return null;
};

export const buildSlicerLayer = (
  polygons: MapConstants.PolygonFeature[],
  colors: MapConstants.LayerProperty,
  opt?: {
    onClick?: (e: MapConstants._ConsumerFeatureProperty) => void;
  },
): L.VectorGrid.Slicer => {
  const featureCollection: FeatureCollection = {
    type: "FeatureCollection" as const,
    features: polygons,
  };

  const layer = L.vectorGrid.slicer(featureCollection, {
    // rendererFactory: L.canvas.tile,
    vectorTileLayerStyles: {
      sliced: {
        weight: 2,
        color: colors.border,
        opacity: 1,
        fill: true,
        fillOpacity: 0.6,
        fillColor: colors.fill,
      },
    },
    maxZoom: 24,
    maxNativeZoom: 24,
    interactive: true,
  });

  layer.on("click", (e: L.LeafletEvent) => {
    if (opt?.onClick) {
      const feature = e.propagatedFrom
        .properties as MapConstants.PolygonFeatureProperty;
      if (feature.type !== "consumer") {
        return;
      }
      opt.onClick(feature.data);
    }
  });

  layer.setZIndex(1000);

  return layer;
};
