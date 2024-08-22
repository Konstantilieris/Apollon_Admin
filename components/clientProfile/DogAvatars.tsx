"use client";
import React from "react";
import { AnimatedTooltip } from "../ui/animated-tooltip";

export function DogAvatars({ dogs }: { dogs: any }) {
  const dogList = dogs.map((dog: any) => {
    return {
      id: dog._id,
      name: dog.name,
      behavior: dog.behavior,
      breed: dog.breed,
      image: "/assets/icons/dog.svg",
    };
  });
  return (
    <div className="absolute  left-[45vw] top-20 flex flex-row items-center gap-2 rounded-lg px-5 py-2 dark:bg-neutral-800">
      <h1>ΚΑΤΟΙΚΙΔΙΑ</h1>
      <AnimatedTooltip items={dogList} />
    </div>
  );
}
