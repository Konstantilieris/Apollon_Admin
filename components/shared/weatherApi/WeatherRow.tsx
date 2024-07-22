"use client";
import React, { useEffect, useState } from "react";
import { fetchWeatherApi } from "openmeteo";
import Image from "next/image";
import { weatherCondition } from "@/lib/utils";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
const WeatherRow = () => {
  const [weatherData, setWeatherData] = useState<any>();

  useEffect(() => {
    const fetchWeatherData = async () => {
      const params = {
        latitude: 37.9011,
        longitude: 23.8727,

        current: [
          "temperature_2m",
          "apparent_temperature",
          "is_day",

          "weather_code",
        ],
        daily: ["weather_code", "temperature_2m_max", "temperature_2m_min"],

        forecast_days: 7,
        timezone: "GMT",
        // Fetch data for the next 3 hours
      };
      const url = "https://api.open-meteo.com/v1/forecast";
      const responses = await fetchWeatherApi(url, params);

      // Process the response
      const response = responses[0];
      const utcOffsetSeconds = response.utcOffsetSeconds();
      const current = response.current()!;

      const daily = response.daily()!;
      const range = (start: number, stop: number, step: number) =>
        Array.from(
          { length: (stop - start) / step },
          (_, i) => start + i * step
        );
      setWeatherData({
        current: {
          time: new Date((Number(current.time()) + utcOffsetSeconds) * 1000),
          temperature2m: current.variables(0)!.value(),
          apparentTemperature: current.variables(1)!.value(),
          isDay: current.variables(2)!.value(),

          weatherCode: current.variables(3)!.value(),
        },
        daily: {
          time: range(
            Number(daily.time()),
            Number(daily.timeEnd()),
            daily.interval()
          ).map((t) => new Date((t + utcOffsetSeconds) * 1000)),
          weatherCode: daily.variables(0)!.valuesArray()!,
          temperature2mMax: daily.variables(1)!.valuesArray()!,
          temperature2mMin: daily.variables(2)!.valuesArray()!,
        },
      });
    };

    fetchWeatherData();
  }, []);

  return (
    <div className="flex flex-col gap-8">
      <div className="background-light900_dark200 text-dark400_light700 flex flex-row items-center justify-between gap-2 rounded-lg p-4 font-sans text-lg font-semibold">
        <span className="flex flex-row items-center gap-2">
          <Image
            src="/assets/icons/clock.svg"
            alt="sun"
            width={30}
            height={20}
            className="invert"
          />
          {weatherData?.current.time.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
          {weatherData?.current.isDay ? (
            <Image
              src="/assets/icons/sun.svg"
              alt="sun"
              width={30}
              height={30}
            />
          ) : (
            <Image
              src="/assets/icons/moon.svg"
              alt="moon"
              width={30}
              height={30}
            />
          )}
        </span>
        <span className="flex flex-row items-center gap-2">
          <h2>Θερμοκρασία τώρα</h2>

          <p className="flex flex-row items-center">
            {~~weatherData?.current.temperature2m}
          </p>
          <Image
            src="/assets/weather/celcius.svg"
            alt="thermometer"
            width={36}
            height={30}
          />
        </span>
        <span className="flex flex-row items-center gap-2">
          <h2>Αίσθηση Θερμοκρασίας</h2>

          <p className="flex flex-row items-center">
            {~~weatherData?.current.apparentTemperature}°C
          </p>
          <Image
            src="/assets/weather/temperature.svg"
            alt="thermometer"
            width={30}
            height={30}
          />
        </span>
        <span className="flex flex-row items-center gap-2">
          {weatherCondition(weatherData?.current.weatherCode).label}
          <Image
            src={weatherCondition(weatherData?.current.weatherCode).imgUrl}
            alt="weather"
            width={38}
            height={30}
          />
        </span>
      </div>
      <div className="background-light900_dark200 text-dark400_light700 flex w-full flex-col items-center justify-center gap-4 rounded-lg py-4">
        <h1 className="text-xl font-bold"> Πρόβλεψη εβδομάδας</h1>
        <Carousel className="w-full max-w-2xl self-center">
          <CarouselContent className="-ml-1 ">
            {Array.from({ length: 7 }).map((_, index) => (
              <CarouselItem
                key={index}
                className="pl-1 md:basis-1/2 lg:basis-1/3"
              >
                <div className="flex flex-col p-1">
                  <span className="text-center text-lg font-semibold">
                    {" "}
                    {weatherData?.daily.time[index].toLocaleDateString("el", {
                      weekday: "short",
                    })}
                  </span>
                  <Card>
                    <CardContent className="flex aspect-square flex-col items-center justify-center gap-4 p-6">
                      <span className="flex flex-row items-center gap-2">
                        <Image
                          src={
                            weatherCondition(
                              weatherData?.daily.weatherCode[index]
                            ).imgUrl
                          }
                          alt="weather"
                          width={38}
                          height={30}
                        />
                      </span>
                      <span className="text-2xl font-semibold">
                        {~~weatherData?.daily.temperature2mMax[index]}°C
                      </span>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="mt-4" />
          <CarouselNext className="mt-4" />
        </Carousel>
      </div>
    </div>
  );
};

export default WeatherRow;
