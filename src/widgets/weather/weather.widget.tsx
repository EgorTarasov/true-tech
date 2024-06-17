import { WeatherEndpoint } from "@/api/endpoints/weather.endpoint";
import LoadingEllipsis from "@/components/ui/loaders/LoadingEllipsis";
import { ELEVATION } from "@/constants/elevation";
import { useEffect, useState } from "react";
import WeatherIcon from "./assets/weather.svg";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { observable } from "mobx";
import { observer } from "mobx-react-lite";

const weather: { temperature: number | null } = observable({
  temperature: null
});

export const WeatherWidget = observer(() => {
  useEffect(() => {
    const fetchWeather = async () => {
      const res = await WeatherEndpoint.getMoscow();

      weather.temperature = res.current.temperature_2m;
    };

    if (!weather.temperature) {
      fetchWeather();
    }
  }, []);

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="appear flex items-center justify-center bg-card border rounded-xl px-2 gap-2 cursor-default">
          <WeatherIcon />
          {weather.temperature ? (
            `${weather.temperature}°С`
          ) : (
            <LoadingEllipsis className="*:bg-slate-300" size={48} />
          )}
        </div>
      </TooltipTrigger>
      <TooltipContent>Погода в Москве</TooltipContent>
    </Tooltip>
  );
});
