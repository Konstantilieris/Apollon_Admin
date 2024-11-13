"use client";

import * as React from "react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { cn } from "@/lib/utils";
import SelectYear from "./SelectYear";

interface ChartData {
  date: string;
  bookings: number;
  totalAmount: number;
}

// New chart data: Monthly bookings and total amount

// Updated chart configuration
const chartConfig = {
  bookings: {
    label: "Αριθμός Κρατήσεων",
    color: "var(--lime-500)",
  },
  totalAmount: {
    label: "Συνολικό Ποσό",
    color: "var(--purple-900)",
  },
} satisfies ChartConfig;

export function BookingChart({ chartData }: { chartData: ChartData[] }) {
  const [activeChart, setActiveChart] =
    React.useState<keyof typeof chartConfig>("bookings");

  const total = React.useMemo(
    () => ({
      bookings: chartData.reduce((acc, curr) => acc + curr.bookings, 0),
      totalAmount: chartData.reduce((acc, curr) => acc + curr.totalAmount, 0),
    }),
    []
  );

  return (
    <Card className="min-h-[85vh]">
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="relative flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>Μηνιαία Ανάλυση Κρατήσεων</CardTitle>
          <CardDescription>
            Παρουσίαση του αριθμού κρατήσεων και του συνολικού ποσού ανά μήνα
          </CardDescription>
          <SelectYear />
        </div>
        <div className="flex">
          {["bookings", "totalAmount"].map((key) => {
            const chart = key as keyof typeof chartConfig;
            return (
              <button
                key={chart}
                className={cn(
                  "relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6",
                  { "bg-neutral-900": activeChart === chart }
                )}
                onClick={() => setActiveChart(chart)}
              >
                <span className="text-muted-foreground text-lg">
                  {chartConfig[chart].label}
                </span>
                <span className="text-lg font-bold leading-none sm:text-3xl">
                  {total[key as keyof typeof total].toLocaleString()}{" "}
                  {chart === "totalAmount" ? "€" : ""}
                </span>
              </button>
            );
          })}
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[65vh] w-full"
        >
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("el-GR", {
                  month: "short",
                  year: "numeric",
                });
              }}
            />
            <ChartTooltip
              cursor={{ fill: "var(--neutral-800)" }}
              content={
                <ChartTooltipContent
                  className="w-[200px] bg-dark-100 text-lg text-light-900"
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("el-GR", {
                      month: "short",
                      year: "numeric",
                    });
                  }}
                  formatter={(value, name) =>
                    `${
                      name === "totalAmount" ? "Σύνολο" : "Κρατήσεις Μήνα"
                    }: ${value}${name === "totalAmount" ? "€" : ""}`
                  }
                />
              }
            />
            <Bar
              dataKey={activeChart}
              fill={
                activeChart === "bookings"
                  ? "var(--lime-500)"
                  : "var(--purple-900)"
              }
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
