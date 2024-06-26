import { IncidentsEndpoint } from "@/api/endpoints/incidents.endpoint";
import { AsyncPagedViewModel } from "@/stores/async-paged.vm";
import { AuthService } from "@/stores/auth.service";
import { IncidentFilters } from "@/types/incident-filters";
import { Incident } from "@/types/incident.type";
import { Issue } from "@/types/issue.type";
import { Priority } from "@/types/priority.type";
import { debounce } from "@/utils/debounce";
import { makeAutoObservable, toJS, when } from "mobx";

class incidentsPageViewModel {
  drawerOpen = false;
  selected: Incident.Item | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  public items = new AsyncPagedViewModel<Incident.Item>(
    async (offset, limit) => {
      this.loading = true;
      try {
        await when(() => AuthService.auth.state === "authenticated");
        const res = await IncidentsEndpoint.getRecents(offset + 220, limit);
        return res.map((v) => Incident.convertDto(v));
      } finally {
        this.loading = false;
      }
    },
  );

  //#region filters
  selectedTab: IncidentFilters.Tab = "heat-source";
  issueType: Issue | null = null;
  sort: "new" | "old" | "priority" = "priority";
  loading = false;
  search = "";
  setSearch = debounce((v: string) => {
    this.search = v;
  }, 300);

  // items: Incident.Item[] = [];

  get heatSources(): Incident.HeatItem[] {
    if (this.selectedTab !== "heat-source") {
      return [];
    }

    const items = this.items.paginatedItems.filter(
      (i) =>
        i.type === "heat-source" &&
        (!this.issueType || i.incidentIssue === this.issueType),
    ) as Incident.HeatItem[];
    return items;
  }

  get consumers(): Incident.ConsumerItem[] {
    if (this.selectedTab === "consumer") {
      return this.items.paginatedItems.filter(
        (i) => i.type === "consumer",
      ) as Incident.ConsumerItem[];
    }
    return [];
  }
  //#endregion

  async select(unom: string) {
    this.selected =
      this.items.paginatedItems.find((i) => i.unom.toString() === unom) || null;
    this.drawerOpen = false;
  }

  async resolve() {
    console.log("resolve");
  }
}

export const IncidentsPageViewModel = new incidentsPageViewModel();
