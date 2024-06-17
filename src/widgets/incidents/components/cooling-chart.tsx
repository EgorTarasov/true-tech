import { observer } from "mobx-react-lite";
import { ElementRef, FC, lazy, useEffect, useId, useRef, useState } from "react";
import { IncidentCardWrapper } from "./incident-card-wrapper";
import { Text } from "@/components/typography/Text";
import {
  ColorRule,
  DataAsArray,
  getLineColorStops,
  useChartData,
  useChartDomain
} from "@/utils/rechart";
import { RechartsLineChart } from "./line-chart/line-chart.component";

const defaultColorRules: ColorRule[] = [
  [-Infinity, "#1D4ED8"],
  [18, "#1D4ED8"],
  [18, "#57C9FF"],
  [20, "#57C9FF"],
  [20, "#16A34A"],
  [+Infinity, "#16A34A"]
];

const data: DataAsArray[] = [
  {
    name: "Температура",
    values: [
      {
        timestamp: "1",
        value: 32
      },
      {
        timestamp: "2",
        value: 24
      },
      {
        timestamp: "3",
        value: 20
      },
      {
        timestamp: "4",
        value: 17
      },
      {
        timestamp: "5",
        value: 15
      },
      {
        timestamp: "6",
        value: 14
      },
      {
        timestamp: "7",
        value: 14.5
      }
    ]
  }
];

interface Props {
  colorRules?: ColorRule[];
  data?: DataAsArray[];
  domainY?: [number, number];
}

export const CoolingChart: FC<Props> = observer((x) => {
  const [rerender, setRerender] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setRerender(true);
    });
  }, []);

  const minValue = (x.data ?? data).reduce((acc, cur) => {
    const values = cur.values.map((v) => v.value);
    return Math.min(acc, ...values);
  }, Infinity);

  const maxValue = (x.data ?? data).reduce((acc, cur) => {
    const values = cur.values.map((v) => v.value);
    return Math.max(acc, ...values);
  }, 0);

  return (
    <IncidentCardWrapper className="p-0 h-[450px]">
      <Text.H3 className="px-6 py-3">Остывание объекта по времени</Text.H3>
      <RechartsLineChart
        colorRules={defaultColorRules}
        data={data}
        domainY={[minValue, maxValue]}
        rerender={rerender}
      />
    </IncidentCardWrapper>
  );
});
