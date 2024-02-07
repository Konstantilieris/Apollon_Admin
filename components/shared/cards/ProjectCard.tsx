"use Client";
import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { deleteTaskById } from "@/lib/actions/task.action";
import { useToast } from "@/components/ui/use-toast";

import { usePathname, useRouter } from "next/navigation";
type ProjectCardProps = {
  id: string;
  title: string | undefined;
  description: string | undefined;
  index?: number;
  task: any;

  handleDragEnd: (sourceId: string, destinationId: string | null) => void;
};
const ProjectCard = ({
  id,
  title,
  description,
  task,
  handleDragEnd,
}: ProjectCardProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id,
    data: { type: "ProjectCard", task },
  });
  const { toast } = useToast();

  const path = usePathname();
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="
        background-light700_dark400
        text-dark100_light900 relative flex h-[160px] min-h-[100px] cursor-grab flex-row items-center justify-center  gap-4 rounded-xl border-2 border-sky-blue p-2.5
        text-left opacity-50 "
      >
        <h1 className="animate-pulse font-noto_sans text-lg font-bold ">
          Σύρε για ολοκλήρωση
        </h1>
        <Image
          src={"/assets/icons/arrow-right.svg"}
          width={30}
          height={30}
          alt="arrow right"
          className="animate-pulse invert"
        />
      </div>
    );
  }
  const handleDeleteClick = async () => {
    try {
      const deletedTask = await deleteTaskById({ id, path });
      if (deletedTask) {
        toast({
          className: cn(
            "bg-celtic-green border-none text-white  font-noto_sans text-center flex flex-center max-w-[300px] bottom-0 left-0 fixed  "
          ),
          title: "Επιτυχία",
          description: "Η εργασία διαγραφθηκε",
        });
        window.location.reload();
      }
    } catch (error) {
      toast({
        className: cn(
          "bg-red-dark border-none text-white  font-noto_sans text-center flex flex-center max-w-[300px] bottom-0 left-0 fixed  "
        ),
        title: "Αποτυχία διαγραφής",
        description: `${error}`,
      });
    }
  };

  return (
    <Card
      style={style}
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className={cn(
        ` text-light850_dark500  ml-4 flex max-w-[740px] flex-col border-2 hover:scale-105 hover:border-sky-blue ${
          task.status === "Completed"
            ? "bg-celtic-green text-white border-black border-2"
            : "background-light700_dark400"
        }`
      )}
    >
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>{description}</CardContent>
      <CardFooter>
        {task.status === "Completed" && (
          <Button onClick={() => handleDeleteClick()}>
            <Image
              src={"/assets/icons/trash.svg"}
              width={20}
              height={20}
              alt="Delete"
            />
            Διαγραφή
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default ProjectCard;
