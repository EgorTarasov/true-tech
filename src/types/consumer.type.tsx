import { ConsumersDto } from "@/api/models/consumers.model";
import { Issue } from "./issue.type";
import { Priority } from "./priority.type";
import * as GJ from "geojson";

export namespace Consumer {
  export type InfoKeys =
    | "Тип потребителя"
    | "Административный округ"
    | "Материал"
    | "Муниципальный район"
    | "Тип"
    | "Площадь"
    | "Этажи"
    | "Класс недвижимости"
    | "УНОМ"
    | "Амортизация"
    | "Адрес"
    | "Квартиры"
    | "Полный адрес"
    | "Страна"
    | "Район"
    | "Особенность"
    | "Входы"
    | "Внешний идентификатор"
    | "Этажи"
    | "Состояние"
    | "Пассажирский лифт"
    | "Серия проекта"
    | "Порядок очистки крыши"
    | "Общая площадь"
    | "УНОМ"
    | "Материал стен"
    | "Материалы крыши"
    | "Общая жилая площадь"
    | "Грузовой лифт"
    | "Общая нежилая площадь"
    | "Виды жилищного фонда"
    | "Вид ТП";

  export interface Polygon {
    id: string;
    position: number[][];
    data: {
      priority: Priority;
    };
  }

  export interface Features {
    feature: GJ.Feature<
      GJ.Polygon,
      {
        priority: Priority;
        number: string;
        source: string;
        balanceHolder: string;
        commissioningDate: number;
      }
    >;
  }

  export type Info = "type";

  export interface Item {
    id: number;
    address: string;
    name: string;
    priority: Priority;
    issue: Issue;
    info: Partial<Record<InfoKeys, string>>;
    incidentCount: number;
    unom: string;
    consumerType: string;
  }

  export const convertDto = (dto: ConsumersDto.Item): Item => {
    if (dto.mkdConsumers && dto.mkdConsumers.length > 1) {
      const item = dto.mkdConsumers[0];

      return {
        id: item.externalID,
        address: item.fullAddress,
        name: item.district,
        priority: Priority.HIGH,
        issue: Issue.EMERGENCY,
        info: {
          Амортизация: item.deprecation.toString(),
          Адрес: item.address,
          Квартиры: item.apartments.toString(),
          "Полный адрес": item.fullAddress,
          Страна: item.country,
          Район: item.district,
          Особенность: item.feature.toString(),
          Входы: item.entrances.toString(),
          "Внешний идентификатор": item.externalID.toString(),
          Этажи: item.floors.toString(),
          Состояние: item.state.toString(),
          "Пассажирский лифт": item.PassengerElevator.toString(),
          "Серия проекта": item.projectSeries.toString(),
          "Порядок очистки крыши": item.roofCleaningSequence.toString(),
          "Общая площадь": item.totalArea.toString(),
          УНОМ: item.unom.toString(),
          "Материал стен": item.wallMaterial.toString(),
          "Материалы крыши": item.roofMaterials.toString(),
          "Общая жилая площадь": item.totalLivingArea.toString(),
          "Грузовой лифт": item.serviceElevator.toString(),
          "Общая нежилая площадь": item.totalNonLivingArea.toString(),
          "Виды жилищного фонда": item.typesOfHousingStock.toString(),
          "Вид ТП": "ЦТП"
        },
        incidentCount: item.События?.length ?? 0,
        unom: item.unom.toString(),
        consumerType: item.wallMaterial.toString()
      };
    } else {
      const item = dto.stateHeatConsumers[0];

      return {
        id: item.unom,
        address: item.admDistrict,
        name: item.municupalDistrict,
        priority: Priority.LOW,
        issue: Issue.EMERGENCY,
        incidentCount: item.События?.length ?? 0,
        unom: item.unom.toString(),
        consumerType: item.material,
        info: {
          "Тип потребителя": item.purpose,
          "Административный округ": item.admDistrict,
          "Вид ТП": "ЦТП",
          Материал: item.material,
          "Муниципальный район": item.municupalDistrict,
          Площадь: item.area ? item.area : undefined,
          Этажи: item.floors,
          "Класс недвижимости": item.propertyClass,
          УНОМ: item.unom.toString()
        }
      };
    }
  };
}
