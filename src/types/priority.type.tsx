import PriorityHighIcon from "@/assets/priority-high.svg";
import PriorityMediumIcon from "@/assets/priority-medium.svg";
import PriorityLowIcon from "@/assets/priority-low.svg";
import PriorityHighAlternateIcon from "@/assets/priority-alternate-high.svg";
import PriorityMediumAlternateIcon from "@/assets/priority-alternate-medium.svg";
import PriorityLowAlternateIcon from "@/assets/priority-alternate-low.svg";

export enum Priority {
  HIGH = 3,
  MEDIUM = 2,
  LOW = 1,
}

export const PriorityLocaleMap = {
  [Priority.HIGH]: {
    locale: "Высокий",
    alternateLocale: "Высокая",
    color: "#EF4444",
    backgroundColor: "rgba(247, 119, 0, 0.2)",
    icon: <PriorityHighIcon />,
    alternateIcon: <PriorityHighAlternateIcon />,
  },
  [Priority.MEDIUM]: {
    locale: "Средний",
    alternateLocale: "Средняя",
    color: "#F78500",
    backgroundColor: "rgba(247, 119, 0, 0.2)",
    icon: <PriorityMediumIcon />,
    alternateIcon: <PriorityMediumAlternateIcon />,
  },
  [Priority.LOW]: {
    locale: "Низкий",
    alternateLocale: "Низкая",
    color: "#FFA903",
    backgroundColor: "rgba(247, 119, 0, 0.2)",
    icon: <PriorityLowIcon />,
    alternateIcon: <PriorityLowAlternateIcon />,
  },
};
