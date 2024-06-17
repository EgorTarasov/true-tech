import React, { FC, useEffect, useId, useRef, useState } from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ReferenceArea,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { ChartProps, ColorRule, RechartsUtils } from "./recharts-utils";
import { ReactNode } from "@tanstack/react-router";

interface LegendProps {
  data: {
    label: string;
    color: string;
  }[];
}

export const RechartsLegend: React.FC<LegendProps> = (x) => {
  return (
    <div className="flex gap-4 justify-center items-center flex-wrap" id="legend">
      {x.data.map((v) => (
        <div
          className="grid grid-cols-[8px_auto] gap-1 justify-start items-center"
          key={v.label}
          id={"legend-item"}>
          <div style={{ borderRadius: "100%", height: "8px", width: "8px", background: v.color }} />
          <div className="text-xs font-normal" id={"legend-text"}>
            {v.label}
          </div>
        </div>
      ))}
    </div>
  );
};

export interface RechartsAxisProps {
  x: number;
  y: number;
  payload: {
    value: number;
  };

  tickType: "date" | "number";
}

export const AxisTick = (x: RechartsAxisProps) => {
  let content: ReactNode = (
    <>
      <tspan textAnchor="middle" x="-15" dy="4" className="fill-foreground">
        {Math.floor(x.payload.value)}
      </tspan>
    </>
  );

  if (x.tickType === "date") {
    content = (
      <tspan textAnchor="middle" x="0" dy="5" className="fill-foreground">
        {x.payload.value}
      </tspan>
    );
  }

  return (
    <g transform={`translate(${x.x},${x.y})`}>
      <text>{content}</text>
    </g>
  );
};

interface LineChartProps extends ChartProps {
  data: RechartsUtils.DataAsArray[];
  domainY: [number, number];
  colorRules?: ColorRule[];
  referenceArea?: [number, number];
  rerender?: boolean;
}

export const RechartsLineChart: FC<LineChartProps> = (x) => {
  const gradientId = useId();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const chartRef = useRef<React.MutableRefObject<any>>(null);
  const linesData = RechartsUtils.useChartData(x.data);
  const [solidColorFill, setSolidColorFill] = useState<string | null>(null);
  const [colorStops, setColorStops] = useState<ColorRule[]>([]);
  const chartClip = useId();

  if (!x.data || x.data.length === 0) {
    return "Отсутствуют данные";
  }

  const key = Object.keys(linesData[0].values)[0];

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    if (!x.colorRules || !chartRef.current?.current) return;

    const responsiveContainer = chartRef.current?.current as HTMLDivElement;
    const line = responsiveContainer.querySelector(
      ".recharts-line-curve"
    ) satisfies SVGPathElement | null;
    const container = responsiveContainer.querySelector(
      ".recharts-cartesian-grid-horizontal"
    ) satisfies SVGPathElement | null;

    if (!line || !container) return;

    const lineBBox = line.getBBox();
    const graphBBox = container.getBBox();

    const lineColorStops = RechartsUtils.getLineColorStops({
      line: lineBBox,
      container: graphBBox,
      domainY: x.domainY,
      colorRules: x.colorRules
    });

    if (typeof lineColorStops === "string") {
      setSolidColorFill(lineColorStops);
    } else {
      setColorStops(lineColorStops);
      setSolidColorFill(null);
    }
  }, [x.data, x.rerender]);

  const lineStroke: string =
    solidColorFill ?? (x.colorRules && colorStops.length !== 0 ? `url(#${gradientId})` : "#57C9FF");

  return (
    <ResponsiveContainer debounce={400} width={"99%"} height={"99%"} ref={chartRef}>
      <LineChart
        syncId={x.syncId}
        data={linesData}
        margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <defs>
          <linearGradient id={gradientId} gradientTransform="rotate(90)">
            {colorStops.map((v, i) => (
              <stop key={i} offset={`${v[0]}%`} stopColor={v[1]} />
            ))}
          </linearGradient>
          {/* чтобы referenceArea не был за пределами графика при приближении */}
          <clipPath id={chartClip}>
            <rect x="40" y="0" width="calc(100% - 60px)" height="100%" fill="transparent" />
          </clipPath>
        </defs>
        <Line
          type="monotone"
          name={key}
          strokeWidth={2}
          dot={false}
          dataKey={`values.${key}`}
          stroke={lineStroke}
          isAnimationActive
        />
        <XAxis
          tick={(p) => <AxisTick {...p} tickType="date" />}
          tickCount={100}
          dataKey="time"
          allowDataOverflow
          type="category"
          className="text-muted-foreground"
        />
        <ReferenceLine y={18} stroke="#1D4ED8" strokeDasharray="3 3" />
        <ReferenceLine y={20} stroke="#57C9FF" strokeDasharray="3 3" />
        <YAxis tick={(p) => <AxisTick {...p} tickType="number" />} width={40} domain={x.domainY} />
        <Tooltip isAnimationActive={false} />
      </LineChart>
    </ResponsiveContainer>
  );
};
