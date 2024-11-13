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
  count: number;
}

// Chart configuration for client count
const chartConfig = {
  clients: {
    label: "Αριθμός Πελατών",
    color: "var(--yellow-800)",
  },
} satisfies ChartConfig;

export function ClientChart({ chartData }: { chartData: ChartData[] }) {
  const totalClients = React.useMemo(
    () => chartData.reduce((acc, curr) => acc + curr.count, 0),
    [chartData]
  );

  return (
    <Card className="min-h-[85vh]">
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="relative flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>Μηνιαία Ανάλυση Πελατών</CardTitle>
          <CardDescription>
            Παρουσίαση του αριθμού πελατών ανά μήνα
          </CardDescription>
          <SelectYear />
        </div>
        <div className="flex">
          <button
            className={cn(
              "relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left sm:border-l sm:border-t-0 sm:px-8 sm:py-6",
              { "bg-neutral-900": true } // Active chart hardcoded as there is only one metric
            )}
          >
            <span className="text-muted-foreground text-lg">
              {chartConfig.clients.label}
            </span>
            <span className="text-lg font-bold leading-none sm:text-3xl">
              {totalClients.toLocaleString()}
            </span>
          </button>
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
                  formatter={(value) => `Σύνολο Πελατών: ${value}`}
                />
              }
            />
            <Bar dataKey="count" fill={chartConfig.clients.color} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
