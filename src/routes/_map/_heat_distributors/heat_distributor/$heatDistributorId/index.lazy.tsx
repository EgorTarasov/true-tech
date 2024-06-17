import { Section } from "@/components/cards/Section";
import { HeatDistributorCardReadonly } from "@/components/cards/heat-distributor.card";
import { IssueLink } from "@/components/cards/issue.card";
import { TitleInfo } from "@/components/cards/title-info";
import { Text } from "@/components/typography/Text";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent
} from "@/components/ui/accordion";
import { buttonVariants } from "@/components/ui/button";
import { LoadingWrapper } from "@/components/ui/loaders/LoadingWrapper";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { HeatDistributorViewModel } from "@/stores/heat-distributor.vm";
import { cn } from "@/utils/cn";
import { SecondarySidebar } from "@/widgets/layoutMainSidebar/SecondarySidebar/secondary-sidebar.widget";
import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { ChevronRightIcon } from "lucide-react";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";

const Page = observer(() => {
  const navigate = useNavigate();
  const unom = Route.useParams().heatDistributorId;
  const [vm] = useState(() => new HeatDistributorViewModel());

  useEffect(() => {
    vm.init(unom);
  }, [unom]);

  return (
    <SecondarySidebar
      closeAction={() => {
        navigate({
          to: "/"
        });
      }}>
      {vm.item ? (
        <div className="flex flex-col">
          <HeatDistributorCardReadonly data={vm.item} />
          <Section className="px-0" title={<span className="px-4">Информация об объекте</span>}>
            <ul className="space-y-2 px-4">
              <TitleInfo title="Вид ТП" info="ЦТП" />
            </ul>
            <Accordion type="single" collapsible>
              <AccordionItem value="1">
                <AccordionTrigger className="px-4">Подробнее</AccordionTrigger>
                <AccordionContent className="px-4">
                  <ul className="space-y-2">
                    {vm.item.info &&
                      Object.entries(vm.item.info).map(([key, value]) => (
                        <TitleInfo key={key} title={key} info={value} />
                      ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </Section>
          {vm.item.incidentCount > 0 && (
            <Section withoutSeparator className="pt-0.5">
              <IssueLink unom={vm.item.unom} count={vm.item.incidentCount} />
            </Section>
          )}
          <Section
            withoutSeparator={vm.item.incidentCount === 0}
            title={
              <>
                <span>Потребители</span>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      to="/heat_distributor/$heatDistributorId/consumers"
                      params={{ heatDistributorId: unom }}
                      className={cn(
                        buttonVariants({ variant: "outline", size: "icon" }),
                        "shadow-none"
                      )}>
                      <ChevronRightIcon />
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent>Перейти к потребителям</TooltipContent>
                </Tooltip>
              </>
            }></Section>
        </div>
      ) : vm.loading ? (
        <LoadingWrapper />
      ) : (
        <div className="flex flex-col gap-2 text-center">
          <Text.Large>Источник тепла не найден</Text.Large>
          <span className="text-muted-foreground">Возможно он был удалён</span>
        </div>
      )}
    </SecondarySidebar>
  );
});

export const Route = createFileRoute(
  "/_map/_heat_distributors/heat_distributor/$heatDistributorId/"
)({
  component: Page
});
