"use client";

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartConfig = {
  numberOfClients: {
    label: "ΕΓΓΡΑΦΕΣ",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export function SubscriptionCardChart({ clientRegistrations }: any) {
  return (
    <div className="h-full w-full">
      <ChartContainer config={chartConfig}>
        <BarChart accessibilityLayer data={clientRegistrations}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="month"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            tickFormatter={(value) => value.slice(0, 3)}
          />
          <ChartTooltip
            cursor={false}
            content={
              <ChartTooltipContent className="bg-neutral-900 text-light-900" />
            }
          />
          <Bar dataKey="numberOfClients" fill="var(--lime-500)" radius={8} />
        </BarChart>
      </ChartContainer>
    </div>
  );
}
