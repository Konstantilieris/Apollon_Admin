import { NoteKanban } from "@/components/kanbanNotes/Notes";

import RevenueCard from "@/components/shared/cards/RevenueCard";
import SubscriptionCard from "@/components/shared/cards/SubscriptionCard";
import WeatherRow from "@/components/shared/weatherApi/WeatherRow";
import {
  getClientStatistics,
  getRegistrationsForPast6Months,
} from "@/lib/actions/client.action";

import {
  getTotalRevenue,
  getPercentageIncrease,
  getPaymentsIncomeLast6Months,
} from "@/lib/actions/service.action";
import { getAllTasks } from "@/lib/actions/task.action";

import React from "react";
export const dynamic = "force-dynamic";
const page = async () => {
  const [
    tasks,
    percentageIncrease,
    totalRevenue,
    { totalClients, clientIncrease },
    clientRegistrations,
    incomeResults,
  ] = await Promise.all([
    getAllTasks(),
    getPercentageIncrease(),
    getTotalRevenue(),
    getClientStatistics(),
    getRegistrationsForPast6Months(),
    getPaymentsIncomeLast6Months(),
  ]);

  return (
    <div className="flex  h-full w-full flex-col  gap-4 overflow-x-hidden pb-2 pl-4 pr-2">
      <div className="flex w-full select-none flex-row">
        <WeatherRow />
        <div className="flex w-full  flex-row gap-4 pl-8">
          <RevenueCard
            percentage={percentageIncrease}
            total={totalRevenue}
            chartData={incomeResults}
          />
          <SubscriptionCard
            total={totalClients}
            percentage={clientIncrease}
            clientRegistrations={clientRegistrations}
          />
        </div>
      </div>
      <NoteKanban tasks={tasks} />
    </div>
  );
};

export default page;
