"use client";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import Image from "next/image";
import {
  DndContext,
  closestCorners,
  DragOverlay,
  useSensors,
  useSensor,
  PointerSensor,
  DragStartEvent,
} from "@dnd-kit/core";
import KanbanColumn from "./KanbanColumn";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import TaskForm from "@/components/form/TaskForm";
import { usePathname } from "next/navigation";

import { createPortal } from "react-dom";

import ProjectCard from "../cards/ProjectCard";

const KanbanBoard = ({ tasks }: any) => {
  const [activeTask, setActiveTask] = useState<any>(null);

  const [open, setOpen] = useState(false);
  const [columns, setColumns] = useState([
    {
      id: "Pending",
      title: "Εκκρεμής",
      tasks: tasks?.filter((task: any) => task.status === "Pending"),
    },
    {
      id: "Completed",
      title: "Ολοκληρωμένο",
      tasks: tasks?.filter((task: any) => task.status === "Completed"),
    },
  ]);

  function onDragStart(event: DragStartEvent) {
    const type = event.active.data.current?.type;
    if (type === "ProjectCard") {
      const task = event.active.data.current?.task;
      setActiveTask(task);
    }
  }

  const handleDragEnd = async ({ active, over }: any, activeTask: any) => {
    if (active?.data?.current?.task.status === "Completed") return;
    const sourceColumn = columns.find((column) => column.id === "Pending");
    const destinationColumn = columns.find(
      (column) => column.id === "Completed"
    );

    // Check if the drag is from "Pending" to "Completed"
    if (
      sourceColumn?.title === "Εκκρεμής" &&
      destinationColumn?.title === "Ολοκληρωμένο"
    ) {
      activeTask.status = "Completed";
      const updatedColumns = columns.map((column) => {
        if (column.id === destinationColumn.id) {
          return {
            ...column,
            tasks: [...column.tasks, activeTask], // Add the activeTask to the tasks of the completed column
          };
        } else if (column.id === sourceColumn.id) {
          return {
            ...column,
            tasks: column.tasks.filter(
              (task: any) => task._id !== activeTask._id
            ),
          };
        }
        return column;
      });

      setColumns(updatedColumns);

      setActiveTask(null);
    }
  };
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 500,
      },
    })
  );

  return (
    <>
      <Button
        className="btn text-light850_dark500 mb-2 min-h-[50px] font-noto_sans text-lg font-bold hover:scale-110"
        onClick={() => setOpen(!open)}
      >
        <Image
          src={"/assets/icons/plus.svg"}
          width={20}
          height={20}
          alt="button"
          className="mr-2 dark:invert"
        />{" "}
        Add Task
      </Button>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger></PopoverTrigger>
        <PopoverContent className="background-light700_dark400 text-dark100_light900  relative mt-4">
          <TaskForm />
        </PopoverContent>
      </Popover>
      <div className="text-dark100_light900  mx-auto flex min-h-screen w-full justify-start overflow-x-auto overflow-y-hidden ">
        <DndContext
          collisionDetection={closestCorners}
          onDragEnd={(event) => handleDragEnd(event, activeTask)}
          onDragStart={onDragStart}
          sensors={sensors}
        >
          <div className="m-auto flex gap-4">
            <div className="flex flex-row gap-4">
              {columns.map((column) => (
                <KanbanColumn
                  key={column.id}
                  id={column.id}
                  title={column.title}
                  tasks={column.tasks}
                  handleDragEnd={handleDragEnd}
                />
              ))}
            </div>
            {createPortal(
              <DragOverlay>
                {activeTask && (
                  <ProjectCard
                    key={activeTask._id}
                    id={activeTask._id}
                    description={activeTask.description}
                    title={activeTask.title}
                    task={activeTask}
                    handleDragEnd={handleDragEnd}
                  />
                )}
              </DragOverlay>,
              document.body
            )}
          </div>
        </DndContext>
      </div>
    </>
  );
};

export default KanbanBoard;
