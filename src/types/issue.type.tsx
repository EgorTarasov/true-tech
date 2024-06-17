import {
  AlertTriangleIcon,
  CalendarClockIcon,
  ThermometerSnowflakeIcon,
  WrenchIcon
} from "lucide-react";
import { LocaleExtended } from "./locale.type";

export enum Issue {
  EMERGENCY = "EMERGENCY",
  REPAIR = "REPAIR",
  TEMPERATURE = "TEMPERATURE",
  PREDICTION = "PREDICTION"
}

export const IssueLocaleMap: LocaleExtended<Issue> = {
  [Issue.EMERGENCY]: {
    backgroundColor: "rgba(239, 68, 68, 0.2)",
    borderColor: "rgba(239, 68, 68, 0.4)",
    color: "#EF4444",
    icon: <AlertTriangleIcon />,
    locale: "Аварийная ситуация"
  },
  [Issue.REPAIR]: {
    backgroundColor: "rgba(22, 163, 74, 0.2)",
    borderColor: "rgba(22, 163, 74, 0.4)",
    color: "#16A34A",
    icon: <WrenchIcon />,
    locale: "Ремонтные работы"
  },
  [Issue.TEMPERATURE]: {
    backgroundColor: "rgba(14, 165, 233, 0.2)",
    borderColor: "rgba(14, 165, 233, 0.4)",
    color: "#0EA5E9",
    icon: <ThermometerSnowflakeIcon />,
    locale: "Снижение температуры"
  },
  [Issue.PREDICTION]: {
    backgroundColor: "rgba(147, 51, 234, 0.2)",
    borderColor: "rgba(147, 51, 234, 0.4)",
    color: "#9333EA",
    icon: <CalendarClockIcon />,
    locale: "Возможна авария"
  }
};
