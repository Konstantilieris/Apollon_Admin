"use client";
import { Tabs } from "@/components/ui/animatedTabs";
import React from "react";
import OwesTab from "./OwesTab";
import PaidTab from "./PaidTab";

export function ServiceTabs({ debts, paid }: { debts: any; paid: any }) {
  const tabs = [
    {
      title: "ΟΦΕΙΛΕΣ",
      value: "owes",
      content: (
        <div className=" relative flex h-full w-full flex-col overflow-hidden rounded-2xl bg-gradient-to-br from-dark-300 to-dark-200 p-10 text-xl font-bold text-light-900 md:text-4xl">
          <p className="mb-8 ">ΟΦΕΙΛΕΣ</p>
          <OwesTab services={debts} />
        </div>
      ),
    },
    {
      title: "ΙΣΤΟΡΙΚΟ",
      value: "services",
      content: (
        <div className="relative h-full w-full overflow-hidden rounded-2xl bg-gradient-to-br from-dark-400 to-dark-100 p-10 text-xl font-bold text-white md:text-4xl">
          <p className="mb-8">ΙΣΤΟΡΙΚΟ</p>
          <PaidTab services={paid} />
        </div>
      ),
    },
  ];

  return (
    <div className=" h-full w-full ">
      <Tabs tabs={tabs} />
    </div>
  );
}
