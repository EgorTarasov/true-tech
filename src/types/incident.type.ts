import { IncidentDto } from "@/api/models/incident.model";
import { Consumer } from "./consumer.type";
import { HeatDistributor } from "./heat.type";
import { Issue } from "./issue.type";
import { MapFilters } from "./map-filters";
import { Priority } from "./priority.type";
import { format } from "date-fns";

/*
openedAt: Открыто в
closedAt: Закрыто в
title: Название
status: Статус
priority: Приоритет
unom: УНОМ
createdAt: Создано в
updatedAt: Обновлено в
mkdConsumer: Потребитель МКД
dispatchServices: Диспетчерские службы
*/
export namespace Incident {
  export interface DependentObjects {
    tps: string;
    heatSource: HeatDistributor.Item | null;
    consumers: Consumer.Item[];
  }

  export interface BaseProps {
    number: string;
    address: string;
    info: Record<string, string | undefined>;
    incidentIssue: Issue;
    incidentStatus: "active" | "closed";
    issueText: string;
    date: Date;
    comments: string[];
    unom: number;
    dependentObjects: DependentObjects;
    heatPolygon?: [[number, number][]];
  }

  export interface HeatItem extends BaseProps {
    type: "heat-source";
    data: HeatDistributor.Item;
  }

  export interface ConsumerItem extends BaseProps {
    type: "consumer";
    data: Consumer.Item;
  }

  export interface GarbageItem extends BaseProps {
    type: "unknown";
    data: null;
  }

  export type Item = HeatItem | ConsumerItem | GarbageItem;

  export const convertDto = (dto: IncidentDto.Item): Incident.Item => {
    const dependentObjects: Incident.DependentObjects = {
      tps: "", // Populate based on dto
      heatSource: null, // Convert dto to HeatDistributor.Item
      consumers: [] // Convert dto to array of Consumer.Item
    };

    const baseProps: Incident.BaseProps = {
      number: dto.id.toString(),
      address: dto.addressInEvent,
      info: {
        "Открыто в": format(dto.externalCreated, "dd.MM.yyyy HH:mm"),
        УНОМ: dto.unom.toString(),
        "Вид ТП": dto.heatPoint?.heating_point_type ?? undefined,
        "Дата ввода в эксплуатацию": dto.heatPoint?.commissioning_date.toString(),
        "Источник отопления": dto.heatPoint?.heating_point_src,
        "Номер точки отопления": dto.heatPoint?.heating_point_number,
        "Тип точки отопления": dto.heatPoint?.heating_point_type,
        "Тип расположения точки отопления": dto.heatPoint?.heating_point_location_type,
        "Муниципальный район": dto.heatPoint?.municipal_district,
        "Полный адрес потребителя": dto.heatPoint?.consumer_full_address.address,
        "Полный адрес точки отопления": dto.heatPoint?.heating_point_full_address.address
      },
      incidentIssue: dto.system === "ml" ? Issue.PREDICTION : Issue.EMERGENCY,
      incidentStatus: dto.completed ? "closed" : "active",
      date: new Date(dto.externalCreated),
      heatPolygon: dto.heatPoint?.heating_point_full_address.border?.find(
        (v) => v.Key === "coordinates"
      )?.Value,
      comments: [], // Add comments if available
      unom: dto.unom,
      issueText: dto.stateConsumers?.at(0)?.События?.at(0)?.title ?? "Аварийная ситуация",
      dependentObjects: {
        tps: dto.heatPoint?.heating_point_src ?? "ТЭЦ-21",
        heatSource: dto.heatPoint
          ? HeatDistributor.convertDto(
              { ...dto.heatPoint, consumers: [] },
              dto.system === "ml",
              dto.heatPoint.priority ?? Priority.LOW
            )
          : null,
        consumers:
          dto.heatPoint?.consumers?.map((v) => ({
            address: v.address,
            consumerType: dto.heatPoint?.heating_point_location_type ?? "",
            id: v.unom,
            incidentCount: 0,
            info: {},
            issue: dto.system === "ml" ? Issue.PREDICTION : Issue.EMERGENCY,
            name: v.municipalDistrict,
            priority: dto.heatPoint?.priority ?? Priority.LOW,
            unom: v.unom.toString()
          })) ?? []
        // consumers: dto.relatedObjects.heatingPoint ? dto.relatedObjects.heatingPoint.consumers?.map(v =)
      }
    };

    // Assuming we need to determine the type based on some DTO fields
    if (dto.heatPoint?.heating_point_full_address.unom === baseProps.unom) {
      return {
        ...baseProps,
        type: "heat-source",
        data: HeatDistributor.convertDto(
          { ...dto.heatPoint, consumers: [] },
          dto.system === "ml",
          dto.heatPoint.priority ?? Priority.LOW
        )
      };
    }

    if (dto.heatPoint?.consumer_full_address.unom === baseProps.unom) {
      return {
        ...baseProps,
        type: "heat-source",
        data: HeatDistributor.convertDto(
          { ...dto.heatPoint, consumers: [] },
          dto.system === "ml",
          dto.heatPoint.priority ?? Priority.LOW
        )
      };
    }

    dto.stateConsumers?.forEach((v) => {
      if (v.unom === baseProps.unom) {
        return {
          ...baseProps,
          type: "consumer",
          data: {
            id: v.unom,
            address: v.admDistrict,
            name: v.municupalDistrict,
            priority: Priority.LOW,
            issue: dto.system === "ml" ? Issue.PREDICTION : Issue.EMERGENCY,
            incidentCount: v.События?.length ?? 0,
            unom: v.unom.toString(),
            consumerType: v.material,
            info: {
              "Тип потребителя": v.purpose,
              "Административный округ": v.admDistrict,
              "Вид ТП": "ЦТП",
              Материал: v.material,
              "Муниципальный район": v.municupalDistrict,
              Площадь: v.area ? v.area : undefined,
              Этажи: v.floors,
              "Класс недвижимости": v.propertyClass,
              УНОМ: v.unom.toString()
            }
          }
        };
      }
    });

    return {
      ...baseProps,
      type: "unknown",
      data: null
    };

    // } else if (dto.stateConsumers) {
    //   return {
    //     ...baseProps,
    //     type: "consumer",
    //     data: dto.mkdConsumer // Assuming first consumer for simplicity
    //   } as Incident.ConsumerItem;
    // } else {
    //   return {
    //     ...baseProps,
    //     type: "unknown",
    //     data: null
    //   };
    // }
  };
}
