"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { cn } from "@/lib/utils";

const ClientLoyalty = ({ loyaltyLevel }: { loyaltyLevel: string }) => {
  const loyaltyIcon = () => {
    switch (loyaltyLevel) {
      case "bronze":
        return (
          <Image
            src="/assets/icons/bronze-medal.svg"
            width={34}
            height={34}
            alt="bronze"
          />
        );
      case "silver":
        return (
          <Image
            src="/assets/icons/silver-medal.svg"
            width={34}
            height={34}
            alt="silver"
          />
        );
      case "gold":
        return (
          <Image
            src="/assets/icons/gold-medal.svg"
            width={34}
            height={34}
            alt="gold"
          />
        );
      case "platinum":
        return <span className="text-xs text-gray-400">Platinum</span>;
    }
  };
  const springConfig = { stiffness: 100, damping: 5 };
  const x = useMotionValue(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const translateX = useSpring(
    useTransform(x, [-100, 100], [-70, 20]),
    springConfig
  );

  return (
    <div
      className="group  relative my-3 flex self-start "
      onMouseEnter={() => setHoveredIndex(1)}
      onMouseLeave={() => setHoveredIndex(null)}
    >
      <AnimatePresence mode="popLayout">
        {hoveredIndex === 1 && (
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
            className="absolute left-1 top-8 flex translate-x-1/2  flex-col items-center justify-center rounded-md bg-dark-200 px-4 py-2 text-xs shadow-xl"
          >
            <div className="absolute inset-x-10 -bottom-px z-50  h-px w-[10%] bg-gradient-to-r from-transparent via-emerald-500 to-transparent " />
            <div className="absolute -bottom-px left-10 z-30 h-px w-[40%] bg-gradient-to-r from-transparent via-sky-500 to-transparent " />
            <div className="relative z-50  text-base font-semibold text-light-900">
              {loyaltyLevel}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <div
        onClick={() => setHoveredIndex(1)}
        className={cn(
          "transition-opacity ease-in duration-300 delay-150",
          hoveredIndex === 1 ? "opacity-80" : "opacity-100"
        )}
      >
        {loyaltyIcon()}
      </div>
    </div>
  );
};

export default ClientLoyalty;
