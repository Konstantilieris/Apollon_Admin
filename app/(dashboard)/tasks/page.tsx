import dynamic from "next/dynamic";
import { getAllTasks } from "@/lib/actions/task.action";
import React from "react";
const DynamicKanbanBoard = dynamic(
  () => import("@/components/shared/kanban/KanbanBoard"),
  { ssr: false }
);
const page = async () => {
  const allTasks = await getAllTasks();
  let tasks = {};
  if (allTasks) {
    tasks = JSON.parse(allTasks);
  }

  return (
    <div className="h-full w-full ">
      <DynamicKanbanBoard tasks={tasks} />
    </div>
  );
};

export default page;
