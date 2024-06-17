import { IssueCard } from "@/components/cards/issue.card";
import { Text } from "@/components/typography/Text";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { IssueLocaleMap } from "@/types/issue.type";
import { cn } from "@/utils/cn";
import { IncidentComments } from "@/widgets/incidents/components/comments";
import { CoolingChart } from "@/widgets/incidents/components/cooling-chart";
import { IncidentCardWrapper } from "@/widgets/incidents/components/incident-card-wrapper";
import { IncidentsMap } from "@/widgets/incidents/components/incidents.map";
import { IncidentInfo } from "@/widgets/incidents/incident-info";
import { IncidentsPageViewModel } from "@/widgets/incidents/incidents.page.vm";
import { DependentObjectsSection } from "@/widgets/incidents/setions/DependentObjects.section";
import { createFileRoute } from "@tanstack/react-router";
import { format } from "date-fns";
import { observer } from "mobx-react-lite";
import { useEffect } from "react";

const vm = IncidentsPageViewModel;

class SeededRandom {
  private seed: number;

  constructor(seed: number) {
    this.seed = seed;
  }

  private random(): number {
    // LCG parameters
    const a = 1664525;
    const c = 1013904223;
    const m = Math.pow(2, 32);
    this.seed = (a * this.seed + c) % m;
    return this.seed / m;
  }

  public randomInRange(min: number, max: number): number {
    return min + this.random() * (max - min);
  }
}

const Page = observer(() => {
  const unom = Route.useParams().unom;

  useEffect(() => {
    vm.select(unom);
  }, [unom]);

  if (!vm.selected) return null;
  const random = new SeededRandom(vm.selected.unom);

  const item = vm.selected;

  return (
    <div className="flex flex-col gap-6 px-4 w-full appear">
      <Button className={cn("w-fit")} disabled={vm.selected.incidentStatus === "closed"}>
        {vm.selected.incidentStatus === "active" ? "Решить задачу" : "Задача решена"}
      </Button>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <IncidentInfo data={item} />
        <div className="flex flex-col gap-2">
          <IncidentCardWrapper
            className="border-2 h-fit gap-2"
            style={{ borderColor: IssueLocaleMap[item.incidentIssue].borderColor }}>
            <IssueCard data={item.incidentIssue} text={item.issueText} />
            <p>
              <span className="font-medium">Дата фиксации события: </span>
              {format(item.date, "dd.MM.yyyy HH:mm")}
            </p>
          </IncidentCardWrapper>
          <IncidentComments data={item} />
        </div>
      </div>
      <Accordion type="single" defaultValue={"dependency"} collapsible>
        <AccordionItem value="dependency" defaultChecked>
          <AccordionTrigger>Зависимые объекты</AccordionTrigger>
          <AccordionContent className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <DependentObjectsSection data={item} selectedUnom={unom} />
            <div className="border-2 border-secondary rounded-sm overflow-hidden">
              <IncidentsMap />
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="math" defaultChecked>
          <AccordionTrigger>Данные по счетчикам</AccordionTrigger>
          <AccordionContent className="grid grid-cols-1 gap-6 lg:grid-cols-[1.4fr_1fr]">
            <CoolingChart />
            <div className="flex flex-col gap-3">
              {[
                {
                  text: `${random.randomInRange(14, 25).toFixed(0)}°С`,
                  title: "Расчётная температура объекта в данный момент"
                },
                {
                  text: `${random.randomInRange(-8, 1).toFixed(0)}%`,
                  title: "Температура воды, поступающей в тепловую сеть"
                },
                {
                  text: `${random.randomInRange(-12, 0).toFixed(1)}%`,
                  title: "Давление в падающем трубопроводе"
                },
                {
                  text: `${random.randomInRange(-0.1, 0).toFixed(2)} кгс/см^2`,
                  title: "Давление в обратном трубопроводе"
                },
                {
                  text: `${random.randomInRange(-6, 6).toFixed(0)}%`,
                  title: "Среднесуточная температура обратной воды из тепловой сети"
                }
              ].map((v, i) => (
                <IncidentCardWrapper key={i} className="items-center gap-3 flex-row px-6 py-6">
                  <Text.H2
                    className={cn(
                      "text-green-600 whitespace-nowrap",
                      i === 0 && "text-[#1D4ED8]",
                      (i === 1 || i === 4) && "text-destructive"
                    )}>
                    {v.text}
                  </Text.H2>
                  <p>{v.title}</p>
                </IncidentCardWrapper>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="history" defaultChecked>
          <AccordionTrigger>История событий</AccordionTrigger>
          <AccordionContent className="grid grid-cols-1 gap-6 lg:grid-cols-[1.4fr_1fr]"></AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
});

export const Route = createFileRoute("/_base/_incidents/incidents/$unom")({
  component: Page
});
