import { DisposableVm } from "@/utils/vm";
import { makeAutoObservable, reaction, toJS, when } from "mobx";
import { Map as MapType } from "leaflet";
import { MapEndpoint } from "@/api/endpoints/map.endpoint";
import { Priority } from "@/types/priority.type";
import { DateRange } from "react-day-picker";
import { Filter, buildFilterKey } from "./filter.vm";
import { MapFilters } from "@/types/map-filters";
import L from "leaflet";
import "leaflet.vectorgrid";
import { buildPropertyFeature, buildSlicerLayer } from "@/utils/map";
import { MapConstants } from "@/constants/map";
import { debounce } from "lodash";
import { HeatDistributor } from "@/types/heat.type";
import { Issue } from "@/types/issue.type";
import { Consumer } from "@/types/consumer.type";
import { PagedViewModel } from "./paged.vm";
import { NavigateFn } from "@tanstack/react-router";

// patch canvas for click events
L.Canvas.Tile.include({
  _onClick: function (e: L.LeafletEvent) {
    const point = this._map.mouseEventToLayerPoint(e).subtract(this.getOffset());
    let layer;
    let clickedLayer;

    for (const id in this._layers) {
      layer = this._layers[id];
      if (
        layer.options.interactive &&
        layer._containsPoint(point) &&
        !this._map._draggableMoved(layer)
      ) {
        clickedLayer = layer;
      }
    }
    if (clickedLayer) {
      clickedLayer.fireEvent(e.type, undefined, true);
    }
  }
});

const filterKeys: {
  getValue: (v: MapConstants.PolygonFeature) => string | null;
  name: string;
}[] = [
  {
    name: "Районы",
    getValue: (v) => v.properties.data.municipal_district.split("район ")[1] || null
  },
  {
    name: "Подключение к ТЭЦ",
    getValue: (v) => v.properties.data.heating_point_src || null
  },
  {
    name: "Тип источника",
    getValue: (v) => v.properties.data.heating_point_type || null
  },
  {
    name: "Муниципальный район адреса потребителя",
    getValue: (v) => v.properties.data.consumerAddress.municipalDistrict || null
  },
  {
    name: "Дата ввода в эксплуатацию",
    getValue: (v) => new Date(v.properties.data.commissioning_date).toLocaleDateString() || null
  },
  {
    name: "Номер теплового пункта",
    getValue: (v) => v.properties.data.heating_point_number || null
  }
];

class mapStore implements DisposableVm {
  navigateFn: NavigateFn | null = null;
  constructor() {
    makeAutoObservable(this);
    void this.init();

    reaction(
      () => [
        this.search,
        this.filters.map((f) => f.values),
        this.consumers.length,
        this.showPriorityFirst
      ],
      () => {
        this.consumersPaged.loading = true;
        this.heatSourcesPaged.loading = true;
        this.consumersPaged.updateItems([]);
        this.heatSourcesPaged.updateItems([]);
        this.filterConsumers();
        this.filterHeatSources();
      }
    );
  }

  // heatSourceVm = new HeatDistributorsViewModel();
  datesWithEvents: Date[] = [new Date()];

  //#region filters
  filters: Filter<MapConstants.PolygonFeature>[] = [];
  search = "";
  showPriorityFirst = true;
  async init() {
    const res = await MapEndpoint.getProperty(0, 0, 0);
    const polygons: MapConstants.PolygonFeature[] = [];

    const filters: Map<string, Set<string>> = new Map();

    res.forEach((v) => {
      const feature = buildPropertyFeature(v);

      if (feature) {
        buildFilterKey(feature, filterKeys, filters);
        polygons.push(feature);
      }
    });

    this.consumers = polygons;
    this.filters = Array.from(filters.entries()).map(
      ([name, values]) =>
        new Filter(name, Array.from(values), filterKeys.find((k) => k.name === name)!.getValue)
    );
  }
  dateRange: DateRange = {
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    to: new Date()
  };
  layer: MapFilters.Layer = MapFilters.Layer.AllObjects;

  reset() {
    this.dateRange = {
      from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      to: new Date()
    };
    this.datesWithEvents = [new Date()];
    this.layer = MapFilters.Layer.AllObjects;
    this.filters.forEach((f) => f.reset());
  }

  filteredConsumersPolygons: MapConstants.PolygonFeature[] | null = null;
  consumersPaged = new PagedViewModel<Consumer.Item>([], 10);
  filterConsumers = debounce(() => {
    if (!this.consumers.length) {
      this.consumersPaged.updateItems([]);
      return;
    }

    const filteredConsumers: Map<string, Consumer.Item> = new Map();
    const filteredConsumersPolygons: MapConstants.PolygonFeature[] = [];

    this.consumers.forEach((v) => {
      if (v.properties.data.consumerAddress.address) {
        if (!filteredConsumers.get(v.properties.data.consumerAddress.unom.toString())) {
          const valid = this.filters.every((f) => f.values.includes(f.getValue(v)!));
          if (valid && v.properties.data.consumerAddress.unom.toString().includes(this.search)) {
            filteredConsumersPolygons.push(v);
            filteredConsumers.set(v.properties.data.consumerAddress.unom.toString(), {
              address: v.properties.data.consumerAddress.address,
              consumerType: "социальный",
              id: v.properties.data.consumerAddress.unom,
              incidentCount: 2,
              issue: Issue.EMERGENCY,
              info: {},
              name: v.properties.data.consumerAddress.address,
              priority: Priority.HIGH,
              unom: v.properties.data.consumerAddress.unom.toString()
            });
          }
        }
      }
    });

    const v = Array.from(filteredConsumers.values());
    if (this.showPriorityFirst) {
      v.sort((a, b) => b.priority - a.priority);
    }

    this.consumersPaged.updateItems(v);
    this.consumersPaged.loading = false;
    this.filteredConsumersPolygons = filteredConsumersPolygons;
    this.buildFeatureLayer();
  }, 1000);

  heatSourcesPaged = new PagedViewModel<HeatDistributor.Item>([], 10);
  filterHeatSources = debounce(() => {
    if (!this.consumers?.length) {
      this.heatSourcesPaged.updateItems([]);
      return;
    }

    const heatSources = new Map<number, HeatDistributor.Item>();
    this.consumers.forEach((v) => {
      const heatSourceUnom = v.properties.data.heatingPointAddress.unom;
      if (!heatSources.get(heatSourceUnom)) {
        const valid = this.filters.every((f) => f.values.includes(f.getValue(v)!));
        if (valid && heatSourceUnom.toString().includes(this.search)) {
          heatSources.set(heatSourceUnom, {
            address: v.properties.data.heatingPointAddress.address,
            consumerCount: 1,
            id: heatSourceUnom,
            incidentCount: 0,
            issue: Issue.EMERGENCY,
            issues: [Issue.EMERGENCY, Issue.REPAIR],
            number: v.properties.data.heating_point_number,
            priority: Priority.HIGH,
            info: null,
            unom: heatSourceUnom.toString()
          });
        }
      } else {
        heatSources.get(heatSourceUnom)!.consumerCount++;
      }
    });
    const v = Array.from(heatSources.values());
    this.heatSourcesPaged.updateItems(v);
    this.heatSourcesPaged.loading = false;
  }, 1000);
  //#endregion

  //#region map
  map: MapType | null = null;

  setMap(m: MapType) {
    if (this.map) {
      this.dispose();
    }

    this.map = m;

    if (this.featureLayer) {
      this.featureLayer.addTo(this.map);
    } else {
      when(() => this.featureLayer !== null).then(() => {
        this.featureLayer!.addTo(this.map!);
      });
    }
  }

  consumers: MapConstants.PolygonFeature[] = [];

  featureLayer: L.VectorGrid.Slicer | null = null;
  buildFeatureLayer() {
    if (this.featureLayer) {
      this.featureLayer.remove();
    }

    if (!this.filteredConsumersPolygons?.length) {
      this.featureLayer?.remove();
      return;
    }

    const layer = buildSlicerLayer(
      toJS(this.filteredConsumersPolygons),
      MapConstants.PolygonProperties.priority.high,
      {
        onClick: (v) => this.onLayerClick(v)
      }
    );

    console.log(this.filteredConsumersPolygons.length);

    this.featureLayer = layer;
    if (this.map) {
      if (this.map.hasLayer(this.featureLayer)) {
        this.featureLayer.remove();
      }
      this.featureLayer.addTo(this.map);
    }
  }

  onLayerClick(v: MapConstants._ConsumerFeatureProperty) {
    this.navigateFn?.({
      to: "/heat_distributor/$heatDistributorId/consumers/$consumerId",
      params: {
        heatDistributorId: v.heatingPointAddress.unom.toString(),
        consumerId: v.consumerAddress.unom.toString()
      }
    });
  }

  selectedConsumer: Consumer.Polygon | null = null;
  setHighlightedConsumer(v: Consumer.Polygon | null) {
    if (this.selectedConsumer) {
      this.selectedConsumer = null;
    }

    this.selectedConsumer = v;
  }
  //#endregion

  dispose(): void {
    this.map = null;
  }
}

export const MapStore = new mapStore();
