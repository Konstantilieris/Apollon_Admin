import { NoteKanban } from "@/components/kanbanNotes/Notes";
import WeatherRow from "@/components/shared/weatherApi/WeatherRow";
import { getAllTasks } from "@/lib/actions/task.action";

import React from "react";
export const dynamic = "force-dynamic";
const page = async () => {
  const tasks = await getAllTasks();
  return (
    <div className="flex  h-full w-full flex-col gap-12 overflow-x-hidden px-4 pb-2">
      <NoteKanban tasks={JSON.parse(tasks)} />

      <WeatherRow />
    </div>
  );
};

export default page;
