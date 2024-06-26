import { MapDto } from "@/api/models/map.model";
import type { Polygon, Feature } from "geojson";
import { z } from "zod";

export namespace MapConstants {
  export type Level = "high" | "medium" | "low" | "unknown";

  export type Layer = "temperature" | "priority";

  export type LayerProperty = {
    border: string;
    fill: string;
  };

  export const PolygonProperties: Record<
    Layer,
    Record<
      Level,
      {
        border: string;
        fill: string;
      }
    >
  > = {
    priority: {
      high: {
        border: "#EF4444",
        fill: "#EF4444",
      },
      medium: {
        border: "#F75900",
        fill: "#F75900",
      },
      low: {
        border: "#FACC15",
        fill: "#FACC15",
      },
      unknown: {
        border: "#aaaaaa",
        fill: "#aaaaaa",
      },
    },
    temperature: {
      high: {
        border: "#1D4ED8",
        fill: "#1D4ED8",
      },
      medium: {
        border: "#57C9FF",
        fill: "#57C9FF",
      },
      low: {
        border: "#16A34A",
        fill: "#16A34A",
      },
      unknown: {
        border: "#aaaaaa",
        fill: "#aaaaaa",
      },
    },
  };

  export type _ConsumerFeatureProperty = Omit<
    z.infer<typeof MapDto.Property>,
    "consumer_full_address" | "heating_point_full_address"
  > & {
    consumerAddress: {
      unom: number;
      address: string;
      municipalDistrict: string;
      center: {
        coordinates: number[] | null;
        type: string;
      };
    };
    heatingPointAddress: {
      unom: number;
      address: string;
      municipalDistrict: string;
      center: {
        type: string;
        coordinates: [number, number];
      };
    };
  };

  export type PolygonFeatureProperty = {
    type: "consumer";
    data: _ConsumerFeatureProperty;
  };

  export type PolygonFeature = Feature<Polygon, PolygonFeatureProperty>;
}
