import { NoteKanban } from "@/components/kanbanNotes/Notes";

import RevenueCard from "@/components/shared/cards/RevenueCard";
import SubscriptionCard from "@/components/shared/cards/SubscriptionCard";
import WeatherRow from "@/components/shared/weatherApi/WeatherRow";
import { getClientStatistics } from "@/lib/actions/client.action";
import {
  getTotalRevenue,
  getPercentageIncrease,
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
  ] = await Promise.all([
    getAllTasks(),
    getPercentageIncrease(),
    getTotalRevenue(),
    getClientStatistics(),
  ]);

  return (
    <div className="flex  h-full w-full flex-col gap-12 overflow-x-hidden px-4 pb-12">
      <div className="flex flex-row">
        <WeatherRow />
        <div className="flex flex-col gap-2 p-1">
          <RevenueCard percentage={percentageIncrease} total={totalRevenue} />
          <SubscriptionCard total={totalClients} percentage={clientIncrease} />
        </div>
      </div>
      <NoteKanban tasks={tasks} />
    </div>
  );
};

export default page;
