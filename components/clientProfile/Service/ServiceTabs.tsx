"use client";
import { Tabs } from "@/components/ui/animatedTabs";
import React from "react";
import OwesTab from "./OwesTab";
import PaidTab from "./PaidTab";
import PaymentTab from "./PaymentsTab";

export function ServiceTabs({
  debts,
  paid,
  payments,
}: {
  debts: any;
  paid: any;
  payments: any;
}) {
  const totalDebt = debts.reduce(
    (acc: any, service: any) => acc + service.amount,
    0
  );
  const totalAmount = paid.reduce(
    (acc: any, service: any) => acc + service.amount,
    0
  );
  const totalPayments = payments.reduce(
    (acc: any, payment: any) => acc + payment.amount,
    0
  );
  const tabs = [
    {
      title: "ΟΦΕΙΛΕΣ",
      value: "owes",
      content: (
        <div className=" relative flex h-full w-full flex-col overflow-hidden rounded-2xl border border-dark-400 bg-gradient-to-br from-dark-100 to-dark-200 p-10   text-light-900 shadow-md shadow-dark-400 md:text-4xl">
          <p className="mb-8 text-lg">ΟΦΕΙΛΕΣ</p>
          <span className="absolute right-12 top-6 rounded-lg border border-gray-700 bg-dark-100 p-2 text-[1.2rem] text-light-900">
            {totalDebt} €
          </span>
          <OwesTab services={debts} />
        </div>
      ),
    },
    {
      title: "ΠΛΗΡΩΜΕΣ",
      value: "payments",
      content: (
        <div className="relative h-full w-full overflow-hidden rounded-2xl border border-dark-400 bg-gradient-to-br from-dark-100 to-dark-200 p-10 text-xl  text-white md:text-4xl">
          <p className="mb-8 text-xl">ΠΛΗΡΩΜΕΣ</p>
          <span className="absolute right-12 top-4 rounded-lg border border-gray-700 bg-dark-100 p-4 text-lg text-green-500">
            {totalPayments} €
          </span>
          <PaymentTab payments={payments} />
        </div>
      ),
    },

    {
      title: "ΙΣΤΟΡΙΚΟ",
      value: "services",
      content: (
        <div className="relative h-full w-full overflow-hidden rounded-2xl border border-dark-400 bg-gradient-to-br from-dark-100 to-dark-200 p-10 text-xl  text-white md:text-4xl">
          <p className="mb-8 text-xl">ΙΣΤΟΡΙΚΟ</p>
          <span className="absolute right-12 top-4 rounded-lg border border-gray-700 bg-dark-100 p-4 text-lg text-green-500">
            {totalAmount} €
          </span>
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
