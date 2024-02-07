import React from "react";
import ProjectCard from "../cards/ProjectCard";

interface Props {
  id: string;
  title: string;
  tasks?: any;
  handleDragEnd: (sourceId: string, destinationId: string | null) => void;
}
const KanbanColumn = ({ id, title, tasks, handleDragEnd }: Props) => {
  return (
    <div className="background-light800_dark300 text-dark300_light700 flex h-[1000px] max-h-[1000px] w-[800px] grow flex-col rounded-md">
      <div className="background-light800_dark300 flex h-[60px]  items-center justify-between rounded-md rounded-b-none border-2 border-black p-3 font-noto_sans text-lg font-bold ">
        <div className="flex gap-2">
          <div className="background-light700_dark400 flex items-center justify-center rounded-full px-2 py-1 text-sm">
            {" "}
            0
          </div>
          {title}{" "}
        </div>
      </div>
      <div className=" mt-4 flex grow flex-col px-4">
        {tasks.map((task: any, index: number) => (
          <ProjectCard
            key={task._id}
            id={task._id}
            title={task.title}
            description={task.description}
            index={index}
            task={task}
            handleDragEnd={handleDragEnd}
          />
        ))}
      </div>
    </div>
  );
};

export default KanbanColumn;
