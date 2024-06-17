import { WeatherDto } from "../models/weather.model";
import api from "../utils/api";

export namespace WeatherEndpoint {
  export const getMoscow = () =>
    api.get(
      "https://api.open-meteo.com/v1/forecast?latitude=55.75&longitude=37.62&current=temperature_2m",
      WeatherDto.Item
    );
}
