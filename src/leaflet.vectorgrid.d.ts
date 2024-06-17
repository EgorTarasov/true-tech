/// <reference types="geojson-vt" />

/* eslint-disable @typescript-eslint/no-explicit-any */
declare namespace L {
  namespace vectorGrid {
    function slicer(geojson: geojsonvt.GeoJSONVT, options?: any): any;
  }
  namespace canvas {
    function tile(options?: any): any;
  }
}
