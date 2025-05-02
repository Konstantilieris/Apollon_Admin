"use client";

import React from "react";
import { Icon } from "@iconify/react";
import { Card, Chip } from "@heroui/react";
import { Bar, BarChart, ResponsiveContainer, XAxis, Tooltip } from "recharts";
import { cn } from "@/lib/utils";

type KPIStatProps = {
  thisWeek: Record<string, number>;
  percentChange: string;
};

const formatWeekday = (weekday: string) => {
  const day =
    {
      Mo: 1,
      Tu: 2,
      We: 3,
      Th: 4,
      Fr: 5,
      Sa: 6,
      Su: 0,
    }[weekday] ?? 0;

  return new Intl.DateTimeFormat("en-US", { weekday: "long" }).format(
    new Date(2024, 0, day)
  );
};

const formatValue = (value: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

export default function KPIStat7({ data }: { data: KPIStatProps }) {
  const chartData = React.useMemo(() => {
    const orderedDays = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
    return orderedDays.map((day) => ({
      weekday: day,
      value: data.thisWeek[day] || 0,
    }));
  }, [data.thisWeek]);

  const totalRevenue = chartData.reduce((sum, d) => sum + d.value, 0);
  const formattedRevenue = formatValue(totalRevenue);

  const changeType = data.percentChange.startsWith("-")
    ? "negative"
    : data.percentChange === "0%"
      ? "neutral"
      : "positive";

  const handleMouseEnter = React.useCallback(
    (chartIndex: number, itemIndex: number) => {
      const bars = document.querySelectorAll(
        `#chart-${chartIndex} .recharts-bar-rectangle`
      );

      bars.forEach((bar, i) => {
        if (i !== itemIndex) {
          const path = bar.querySelector("path");

          if (path) {
            path.setAttribute("fill", "hsl(var(--heroui-default-300))");
          }
        }
      });
    },
    []
  );

  const handleMouseLeave = React.useCallback((chartIndex: number) => {
    const bars = document.querySelectorAll(
      `#chart-${chartIndex} .recharts-bar-rectangle`
    );

    bars.forEach((bar) => {
      const path = bar.querySelector("path");

      if (path) {
        path.setAttribute("fill", "hsl(var(--heroui-foreground))");
      }
    });
  }, []);

  const trendChipContent = ({
    changeType,
    change,
    trendChipPosition,
  }: {
    changeType: string;
    change: string;
    trendChipPosition: string;
  }) => (
    <div
      className={cn({
        "self-start": trendChipPosition === "top",
        "self-end": trendChipPosition === "bottom",
      })}
    >
      <Chip
        classNames={{
          content: "font-medium",
        }}
        color={
          changeType === "positive"
            ? "success"
            : changeType === "neutral"
              ? "warning"
              : changeType === "negative"
                ? "danger"
                : "default"
        }
        radius="sm"
        size="sm"
        startContent={
          changeType === "positive" ? (
            <Icon height={16} icon={"solar:arrow-right-up-linear"} width={16} />
          ) : changeType === "neutral" ? (
            <Icon height={16} icon={"solar:arrow-right-linear"} width={16} />
          ) : (
            <Icon
              height={16}
              icon={"solar:arrow-right-down-linear"}
              width={16}
            />
          )
        }
        variant="flat"
      >
        <span>{change}</span>
      </Chip>
    </div>
  );

  return (
    <Card className="min-h-[120px] border border-transparent px-4 dark:border-default-100">
      <section className="flex h-full flex-nowrap items-center justify-between">
        <div className="flex h-full flex-col gap-y-3 py-4 md:flex-row md:justify-between md:gap-x-2">
          <div className="flex h-full w-full flex-col justify-between gap-y-3">
            <dt className="flex items-center gap-x-2 text-base font-medium text-default-500">
              Εβδομαδιαία Έσοδα
              <div className="md:hidden">
                {trendChipContent({
                  changeType,
                  change: data.percentChange,
                  trendChipPosition: "bottom",
                })}
              </div>
            </dt>
            <div className="flex gap-x-2">
              <dd className="text-3xl font-semibold text-default-700">
                {formattedRevenue}
              </dd>
              <div className="hidden self-end md:block">
                {trendChipContent({
                  changeType,
                  change: data.percentChange,
                  trendChipPosition: "bottom",
                })}
              </div>
            </div>
          </div>
        </div>
        <div className="flex h-[120px] w-[180px] shrink-0 items-center">
          <ResponsiveContainer
            className="[&_.recharts-surface]:outline-none"
            height="100%"
            width="100%"
          >
            <BarChart
              accessibilityLayer
              barSize={12}
              data={chartData}
              id="chart-0"
              margin={{ top: 24, bottom: 4 }}
            >
              <XAxis
                axisLine={false}
                dataKey="weekday"
                style={{ fontSize: "var(--heroui-font-size-tiny)" }}
                tickLine={false}
              />
              <Tooltip
                content={({ label, payload }) => (
                  <div className="flex h-8 min-w-[80px] items-center gap-x-2 rounded-medium bg-background p-2 text-tiny shadow-small">
                    <div className="h-2 w-2 rounded-sm bg-foreground" />
                    <span className="text-default-500">
                      {formatWeekday(label)}
                    </span>
                    <span className="font-medium text-default-700">
                      {formatValue(payload?.[0]?.value as number)}
                    </span>
                  </div>
                )}
                cursor={false}
              />
              <Bar
                background={{
                  fill: "hsl(var(--heroui-default-200))",
                  radius: 8,
                }}
                className="transition-colors"
                dataKey="value"
                fill="hsl(var(--heroui-foreground))"
                radius={8}
                onMouseEnter={(_, itemIndex) => handleMouseEnter(0, itemIndex)}
                onMouseLeave={() => handleMouseLeave(0)}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>
    </Card>
  );
}
