"use client";

import React from "react";

import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Bar, BarChart, XAxis, YAxis } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { IconSquareRotatedFilled } from "@tabler/icons-react";

const ClientStatsCard = ({ client }: any) => {
  const chartData = [
    {
      type: "ΣΥΝΟΛΟ",
      amount: client.totalSpent ?? 0,
      fill: "var(--lime-500)",
    },
    {
      type: "ΟΦΕΙΛΕΣ",
      amount: client.owesTotal ?? 0,
      fill: "var(--red-500)",
    },

    { type: "ΥΠΟΛΟΙΠΟ", amount: client.credit ?? 0, fill: "var(--blue-500)" },
  ];

  const chartConfig: ChartConfig = {
    amount: {
      label: "Ποσό",
    },
  };

  return (
    <Card className="group relative max-h-[15vh] w-full min-w-[15vw]  max-w-[17vw] select-none self-end overflow-y-hidden border-none bg-neutral-900 py-1">
      <CardTitle className="absolute right-0 top-0 z-50 flex translate-y-0 flex-row gap-4 rounded-xl bg-neutral-900 p-1 text-sm  opacity-100 transition-all duration-700 group-hover:translate-y-[-20px] group-hover:opacity-0">
        <span className="flex flex-row items-center text-lime-500">
          <IconSquareRotatedFilled size={14} />
          {client.totalSpent ?? 0}
        </span>
        <span className="flex flex-row items-center text-red-500">
          <IconSquareRotatedFilled size={14} />
          {client.owesTotal ?? 0}
        </span>
        <span className="flex flex-row items-center text-blue-500">
          <IconSquareRotatedFilled size={14} />
          {client.credit ?? 0}
        </span>
      </CardTitle>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{
              left: 20,
            }}
          >
            <YAxis
              dataKey="type"
              type="category"
              tickLine={false}
              tickMargin={2}
              axisLine={false}
              tick={{
                fill: "white",
                fontSize: 13,
                fontWeight: 500,
                fontFamily: "inherit",
              }}
            />
            <XAxis dataKey="amount" type="number" hide />
            <ChartTooltip
              cursor={false}
              formatter={(value: number) => `Ποσό: ${value} €`}
              content={
                <ChartTooltipContent
                  hideLabel
                  className="min-w-[7vw] bg-neutral-950 p-1 font-sans text-sm text-light-900"
                />
              }
            />
            <Bar dataKey="amount" layout="vertical" radius={5}></Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default ClientStatsCard;
