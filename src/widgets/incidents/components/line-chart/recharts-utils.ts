import { Property } from "csstype";
import { useMemo } from "react";

export type ColorRule = [value: number, color: Property.StopColor];
export type ChartStatus = "warn" | "bad" | "good";

export interface ChartProps {
  syncId?: string | number;
  printMode?: boolean;
}

export namespace RechartsUtils {
  export type DataAsArray = {
    name: string;
    values: {
      /**
       * epoch seconds
       */
      timestamp: string;
      value: number | string;
    }[];
  };

  export type DataAsObject = {
    time: string;
    values: { [key: string]: number | string };
  };

  export function useChartData(input: DataAsArray[]): DataAsObject[] {
    return useMemo<DataAsObject[]>(() => {
      const newData: DataAsObject[] = [];

      input.forEach((data) => {
        data.values.forEach((value, i) => {
          if (!newData[i]) {
            const time = value.timestamp;
            newData[i] = {
              time,
              values: {}
            };
          }

          const dataRow = newData[i];
          if (dataRow) {
            dataRow.values[data.name] = value.value;
          }
        });
      });
      return newData;
    }, [input]);
  }

  export function getLineColorStops(x: {
    line: DOMRect;
    container: DOMRect;
    domainY: [number, number];
    colorRules: ColorRule[];
  }): ColorRule[] | Property.StopColor {
    const scale = x.line.height / x.container.height;

    const lineRelativeCenterPosition = x.line.y - x.container.y + x.line.height / 2;
    const bias = (x.container.height / 2 - lineRelativeCenterPosition) / x.container.height;

    let lowerBound = x.domainY[0];
    let upperBound = x.domainY[1];

    const domainAmplitude = upperBound - lowerBound;
    const biasAmplitude = domainAmplitude * bias;
    lowerBound += biasAmplitude;
    upperBound += biasAmplitude;

    let lastZero = -1;
    let firstHundred = -1;

    const allStops: ColorRule[] = x.colorRules.map(([value, color], index) => {
      const bounded = (value - lowerBound) / domainAmplitude;

      const scaled = ((bounded - 0.5) / scale) * 100 + 50;

      if (scaled <= 0) {
        lastZero = index;
        return [0, color];
      }
      if (scaled >= 100) {
        if (firstHundred === -1) firstHundred = index;
        return [100, color];
      }

      return [scaled, color];
    });

    if (firstHundred > 0) allStops.splice(firstHundred + 1, +Infinity);

    if (lastZero > 0) allStops.splice(0, lastZero);

    const firstStop = allStops[0]?.[1];
    let hasAnyTransitions = false;
    for (let i = 1; i < allStops.length; i++) {
      if (allStops[i][1] !== firstStop) {
        hasAnyTransitions = true;
        break;
      }
    }

    if (!hasAnyTransitions) return firstStop;

    allStops.reverse();

    for (const allStop of allStops) {
      allStop[0] = 100 - allStop[0];
    }

    return allStops;
  }
}
