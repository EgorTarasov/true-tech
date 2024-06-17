import { Section } from "@/components/cards/Section";
import { ConsumerCardReadonly } from "@/components/cards/consumer.card";
import { HeatDistributorCard } from "@/components/cards/heat-distributor.card";
import { IssueLink } from "@/components/cards/issue.card";
import { TitleInfo } from "@/components/cards/title-info";
import { Text } from "@/components/typography/Text";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion";
import { buttonVariants } from "@/components/ui/button";
import { LoadingWrapper } from "@/components/ui/loaders/LoadingWrapper";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { ConsumerViewModel } from "@/stores/consumer.vm";
import { MapStore } from "@/stores/map.store";
import { cn } from "@/utils/cn";
import { SecondarySidebar } from "@/widgets/layoutMainSidebar/SecondarySidebar/secondary-sidebar.widget";
import { Link, createFileRoute, useMatches, useNavigate } from "@tanstack/react-router";
import { ChevronRightIcon } from "lucide-react";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";

const Page = observer(() => {
  const navigate = useNavigate();
  const [vm] = useState(() => new ConsumerViewModel());
  const { consumerId, heatDistributorId } = Route.useParams();

  useEffect(() => {
    vm.init(consumerId, heatDistributorId);
  }, [consumerId, heatDistributorId]);

  return (
    <SecondarySidebar
      closeAction={() => {
        navigate({
          to: "/heat_distributor/$heatDistributorId/consumers",
          params: { heatDistributorId }
        });
      }}>
      <>
        {vm.item && (
          <div className="flex flex-col">
            <ConsumerCardReadonly data={vm.item} />
            <Section
              className="px-0 pb-2"
              title={<span className="px-4">Информация об объекте</span>}>
              {vm.item.info["Вид ТП"] && (
                <ul className="space-y-2 px-4">
                  <TitleInfo title="Вид ТП" info={vm.item.info["Вид ТП"]} />
                </ul>
              )}
              <Accordion type="single" collapsible>
                <AccordionItem value="1">
                  <AccordionTrigger className="px-4">Подробнее</AccordionTrigger>
                  <AccordionContent className="px-4">
                    <ul className="space-y-2">
                      {Object.entries(vm.item.info).map(([key, value]) => (
                        <TitleInfo key={key} title={key} info={value} />
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </Section>
            {vm.item.incidentCount > 0 && (
              <Section withoutSeparator className="pt-1">
                <IssueLink unom={vm.item.unom} count={vm.item.incidentCount} />
              </Section>
            )}
            <Section
              className="px-0"
              title={
                <div className="flex px-4 items-center justify-between w-full">
                  <span>Источник тепла</span>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link
                        to="/heat_distributor/$heatDistributorId"
                        params={{ heatDistributorId }}
                        className={cn(
                          buttonVariants({ variant: "outline", size: "icon" }),
                          "shadow-none"
                        )}>
                        <ChevronRightIcon />
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent>Перейти к источнику тепла</TooltipContent>
                  </Tooltip>
                </div>
              }>
              {vm.heatDistributor && (
                <Link
                  to="/heat_distributor/$heatDistributorId"
                  params={{
                    heatDistributorId
                  }}>
                  <HeatDistributorCard className="mt-2 cursor-pointer" data={vm.heatDistributor} />
                </Link>
              )}
            </Section>
          </div>
        )}
        {vm.loading && <LoadingWrapper />}
        {!vm.loading && !vm.item && (
          <div className="flex flex-col gap-2 text-center pt-5">
            <Text.Large>Потребитель не найден</Text.Large>
            <span className="text-muted-foreground">Возможно он был удалён</span>
          </div>
        )}
      </>
    </SecondarySidebar>
  );
});

export const Route = createFileRoute(
  "/_map/_heat_distributors/heat_distributor/$heatDistributorId/_consumers/consumers/$consumerId"
)({
  component: Page
});
