"use client";

import React, { useState } from "react";
import {
  motion,
  useTransform,
  AnimatePresence,
  useMotionValue,
  useSpring,
} from "framer-motion";
import { cn } from "@/lib/utils";
import { IconUserFilled } from "@tabler/icons-react";

export const DogTooltip = ({
  items,
}: {
  items: {
    _id: any;
    dogName: string;
  }[];
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const springConfig = { stiffness: 100, damping: 5 };
  const x = useMotionValue(0); // going to set this value on mouse move
  // rotate the tooltip

  // translate the tooltip
  const translateX = useSpring(
    useTransform(x, [-100, 100], [-70, 20]), // Shift the tooltip more to the left
    springConfig
  );

  return (
    <>
      {items.map((item, idx) => (
        <div
          className="group  relative my-1 "
          key={item.dogName}
          onMouseEnter={() => setHoveredIndex(item._id)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <AnimatePresence mode="popLayout">
            {hoveredIndex === item._id && (
              <motion.div
                initial={{ opacity: 0, y: 0, scale: 0.6 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  transition: {
                    type: "spring",
                    stiffness: 260,
                    damping: 10,
                  },
                }}
                exit={{ opacity: 0, y: 10, scale: 0.6 }}
                style={{
                  translateX,

                  whiteSpace: "nowrap",
                }}
                className="absolute -left-1/2 -top-16 z-50 flex translate-x-1/2  flex-col items-center justify-center rounded-md bg-black px-4 py-2 text-xs shadow-xl"
              >
                <div className="absolute inset-x-10 -bottom-px z-30 h-px w-[20%] bg-gradient-to-r from-transparent via-emerald-500 to-transparent " />
                <div className="absolute -bottom-px left-10 z-30 h-px w-[40%] bg-gradient-to-r from-transparent via-sky-500 to-transparent " />
                <div className="relative z-30 text-base font-bold text-white">
                  {item.dogName}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <IconUserFilled
            className={cn(
              "relative !m-0 h-8 w-8 object-cover object-top !p-0  text-light-700 animate-pulse"
            )}
          />
        </div>
      ))}
    </>
  );
};
