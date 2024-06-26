import { Issue, IssueLocaleMap } from "@/types/issue.type";
import { pluralizeIncident } from "@/utils/pluralize/incident";
import { IncidentsPageViewModel } from "@/widgets/incidents/incidents.page.vm";
import { Link } from "@tanstack/react-router";
import { ChevronRightIcon } from "lucide-react";
import { observer } from "mobx-react-lite";
import { FC } from "react";

export const IssueCard: FC<{ data: Issue; text?: string }> = (x) => {
  const v = IssueLocaleMap[x.data];
  return (
    <div
      className="py-1 px-1.5 w-fit space-x-2 rounded-sm flex gap-1 text-sm items-center dark:opacity-80"
      style={{
        backgroundColor: v.backgroundColor,
        color: v.color,
      }}
    >
      <span className="*:size-4">{v.icon}</span>
      {x.text ?? v.locale}
    </div>
  );
};

export const IssueIcon = ({
  data,
  className,
}: {
  data: Issue;
  className?: string;
}) => {
  const v = IssueLocaleMap[data];
  return (
    <span className={className} style={{ color: v.color }}>
      {v.icon}
    </span>
  );
};

export const IssueLink: FC<{ unom: string; count: number }> = observer((x) => (
  <Link
    className="border px-4 py-3 rounded-xl hover:bg-background text-sm space-y-2 group transition-colors"
    to="/incidents/$unom"
    onClick={() => {
      IncidentsPageViewModel.search = x.unom;
    }}
    params={{ unom: x.unom }}
  >
    <p>
      Имеется информация о {x.count} {pluralizeIncident(x.count)}, связанных с
      этим объектом
    </p>
    <div className="flex items-center gap-2 text-muted-foreground">
      Перейти к инцидентам <ChevronRightIcon className="size-5" />
    </div>
  </Link>
));
