import { Incident } from "@/types/incident.type";
import { cn } from "@/utils/cn";
import { FC } from "react";
import { IncidentCardWrapper } from "../components/incident-card-wrapper";
import { ChevronDown } from "lucide-react";
import { PriorityIcon } from "@/components/cards/priority-icon";
import { Text } from "@/components/typography/Text";
import { TitleInfo } from "@/components/cards/title-info";

const Dot: FC<{ className?: string }> = (x) => (
  <span className={cn("size-4 rounded-full absolute left-[16.5px] top-4", x.className)} />
);

const Arrow = () => (
  <>
    <span className="absolute left-[23px] w-0.5 bg-muted-foreground -bottom-5 top-10" />
    <ChevronDown className="absolute text-muted-foreground left-4 size-4 -bottom-[26px]" />
  </>
);

export const DependentObjectsSection: FC<{ data: Incident.Item; selectedUnom: string }> = (x) => {
  return (
    <div className="flex flex-col flex-1 gap-3 max-h-[450px] overflow-auto">
      <div className="flex relative items-center pl-12">
        <Dot className="bg-muted-foreground" />
        <Arrow />
        <IncidentCardWrapper className="text-muted-foreground px-3 w-full">
          {x.data.dependentObjects.tps}
        </IncidentCardWrapper>
      </div>
      {x.data.dependentObjects.heatSource && (
        <div className="flex relative items-center pl-12">
          <Dot className="bg-destructive" />
          <Arrow />
          <IncidentCardWrapper
            className={cn(
              "text-muted-foreground px-3 flex-row gap-3 items-start w-full",
              x.selectedUnom === x.data.unom.toString() && "border-secondary bg-accent",
              x.data.dependentObjects.heatSource.issue && "border-destructive text-red-500"
            )}>
            <PriorityIcon data={x.data.dependentObjects.heatSource.priority} alternate />
            <div className="space-y-1">
              <Text.SubtleMedium>ЦТП {x.data.address}</Text.SubtleMedium>
              <ul className="flex gap-x-2 flex-wrap">
                <li>V остывания = 1.01°C/ч</li>
                <span>I остывания = 10.01 ч.</span>
              </ul>
            </div>
          </IncidentCardWrapper>
        </div>
      )}
      {x.data.dependentObjects.consumers.map((item, i) => (
        <div className="flex relative items-center pl-12">
          {i === 0 && <Dot className="bg-sky-500 dark:bg-sky-500/70" />}
          <IncidentCardWrapper
            key={i}
            className={cn(
              "flex gap-3 items-start flex-row px-3 w-full",
              item.unom.toString() === x.selectedUnom && "border-secondary bg-accent"
            )}>
            <PriorityIcon data={item.priority} alternate />
            <div className="space-y-1">
              <Text.SubtleMedium className="size-sm">{item.address}</Text.SubtleMedium>
              <p>{item.name}</p>
              <TitleInfo title="Тип потребителя" info={item.consumerType} />
            </div>
          </IncidentCardWrapper>
        </div>
      ))}
      {x.data.dependentObjects.consumers.length === 0 && (
        <div className="flex relative items-center pl-12">
          <Dot className="bg-sky-500 dark:bg-sky-500/70" />
          <IncidentCardWrapper className={cn("flex gap-3 items-start flex-row px-3 w-full")}>
            <div className="space-y-1">
              <p>Потребители</p>
            </div>
          </IncidentCardWrapper>
        </div>
      )}
    </div>
  );
};
