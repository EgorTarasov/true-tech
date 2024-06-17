import { HeatDistributorDto } from "@/api/models/heat-distribution.model";
import { Issue } from "./issue.type";
import { Priority } from "./priority.type";
import { MapDto } from "@/api/models/map.model";

/*
balance_holder: Балансодержатель
commissioning_date: Дата ввода в эксплуатацию
heating_point_src: Источник отопления
heating_point_number: Номер точки отопления
heating_point_type: Тип точки отопления
heating_point_location_type: Тип расположения точки отопления
municipal_district: Муниципальный район
consumer_full_address: Полный адрес потребителя
heating_point_full_address: Полный адрес точки отопления
consumers: Потребители
*/

export namespace HeatDistributor {
  export type Info =
    | "Балансодержатель"
    | "Дата ввода в эксплуатацию"
    | "Источник отопления"
    | "Номер точки отопления"
    | "Тип точки отопления"
    | "Тип расположения точки отопления"
    | "Муниципальный район"
    | "Полный адрес потребителя"
    | "Полный адрес точки отопления";

  export interface Item {
    id: number;
    number: string;
    address: string;
    issue: Issue | null;
    priority: Priority;
    consumerCount: number;
    issues: Issue[];
    info: Record<Info, string> | null;
    incidentCount: number;
    unom: string;
  }

  export const convertDto = (
    v: MapDto.Property,
    isMl?: boolean,
    priority?: number
  ): HeatDistributor.Item => ({
    id: v.consumer_full_address.unom,
    number: v.heating_point_number,
    address: v.heating_point_full_address.address,
    issue: isMl ? Issue.PREDICTION : Issue.EMERGENCY,
    priority: priority ?? Priority.HIGH,
    consumerCount: 1,
    issues: [Issue.EMERGENCY, Issue.REPAIR],
    incidentCount: 0,
    unom: v.heating_point_full_address.unom.toString(),
    info: {
      Балансодержатель: v.balance_holder,
      "Дата ввода в эксплуатацию": v.commissioning_date.toString(),
      "Источник отопления": v.heating_point_src,
      "Номер точки отопления": v.heating_point_number,
      "Тип точки отопления": v.heating_point_type,
      "Тип расположения точки отопления": v.heating_point_location_type,
      "Муниципальный район": v.municipal_district,
      "Полный адрес потребителя": v.consumer_full_address.address,
      "Полный адрес точки отопления": v.heating_point_full_address.address
    }
  });
}
