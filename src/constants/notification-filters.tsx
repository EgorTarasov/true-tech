import { LocaleWithIcon } from "@/types/locale.type";
import { ArrowUpDownIcon, Clock4Icon } from "lucide-react";

export namespace NotificationFilters {
  export enum Sort {
    Priority = "priority",
    Recent = "recent"
  }
}

export namespace NotificationFiltersLocale {
  export const Sort: LocaleWithIcon<NotificationFilters.Sort> = {
    [NotificationFilters.Sort.Priority]: {
      locale: "Сначала приоритетные",
      icon: <ArrowUpDownIcon />
    },
    [NotificationFilters.Sort.Recent]: {
      locale: "Сначала новые",
      icon: <Clock4Icon />
    }
  };
}
