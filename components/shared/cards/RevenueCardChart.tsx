"use client";

import { CartesianGrid, Dot, Line, LineChart } from "recharts";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartConfig = {
  totalIncome: {
    label: "Μηνιαία Έσοδα",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export function RevenueCardChart({ chartData }: any) {
  return (
    <div className="h-full w-full">
      <ChartContainer config={chartConfig}>
        <LineChart
          accessibilityLayer
          data={chartData}
          margin={{
            top: 24,
            left: 24,
            right: 24,
          }}
        >
          <CartesianGrid vertical={false} />
          <ChartTooltip
            cursor={true}
            content={
              <ChartTooltipContent
                indicator="line"
                nameKey="totalIncome"
                className="bg-neutral-900 text-light-900"
                labelFormatter={(label: string) => `${label}`} // Use the month as the label
                formatter={(
                  value: number | string | Array<number | string>,
                  name: string | number | undefined,
                  props: any
                ) => `${props.payload.month}: ${value} €`} // Format as month: value €
              />
            }
          />
          <Line
            dataKey="totalIncome"
            type="natural"
            stroke="var(--lime-800)"
            strokeWidth={2}
            dot={({ payload, ...props }) => {
              return (
                <Dot
                  key={payload.month}
                  r={5}
                  cx={props.cx}
                  cy={props.cy}
                  fill="var(--lime-500)"
                  stroke={payload.fill}
                />
              );
            }}
          />
        </LineChart>
      </ChartContainer>
    </div>
  );
}
