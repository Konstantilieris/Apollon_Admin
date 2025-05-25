"use client";

import React from "react";
import { Card, Chip, cn } from "@heroui/react";
import { Icon } from "@iconify/react";

type TrendCardProps = {
  title: string;
  value: string;
  change: string;
  changeType: "positive" | "neutral" | "negative";
  trendType: "up" | "neutral" | "down";
  trendChipPosition?: "top" | "bottom";
  trendChipVariant?: "flat" | "light";
};

export const TrendCard = ({
  title,
  value,
  change,
  changeType,
  trendType,
  trendChipPosition = "top",
  trendChipVariant = "light",
}: TrendCardProps) => {
  return (
    <Card className=" min-h-[120px] min-w-[270px] border border-transparent dark:border-default-100">
      <div className="flex p-6">
        <div className="flex flex-col gap-y-2">
          <dt className="text-base font-medium text-default-500">{title}</dt>
          <dd className="text-2xl font-semibold text-default-700">{value}</dd>
        </div>
        <Chip
          className={cn("absolute right-4", {
            "top-4": trendChipPosition === "top",
            "bottom-4": trendChipPosition === "bottom",
          })}
          classNames={{
            content: "font-medium text-[0.85rem]",
          }}
          color={
            changeType === "positive"
              ? "success"
              : changeType === "neutral"
                ? "warning"
                : "danger"
          }
          radius="sm"
          size="md"
          startContent={
            trendType === "up" ? (
              <Icon
                height={14}
                icon={"solar:arrow-right-up-linear"}
                width={14}
              />
            ) : trendType === "neutral" ? (
              <Icon height={14} icon={"solar:arrow-right-linear"} width={14} />
            ) : (
              <Icon
                height={14}
                icon={"solar:arrow-right-down-linear"}
                width={14}
              />
            )
          }
          variant={trendChipVariant}
        >
          {change}
        </Chip>
      </div>
    </Card>
  );
};
