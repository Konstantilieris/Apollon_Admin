"use client";
import { useBookingStore } from "@/hooks/booking-store";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import React from "react";

const BookingSuggestionResult = ({ children, setOpen }: any) => {
  const { resetStore } = useBookingStore();
  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{
          opacity: 0,
        }}
        animate={{
          opacity: 1,
          backdropFilter: "blur(10px)",
        }}
        exit={{
          opacity: 0,
          backdropFilter: "blur(0px)",
        }}
        className="fixed inset-0 z-50 flex h-full w-full  items-center justify-center [perspective:800px] [transform-style:preserve-3d]"
      >
        <motion.div
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
            backdropFilter: "blur(10px)",
          }}
          exit={{
            opacity: 0,
            backdropFilter: "blur(0px)",
          }}
          className={`fixed  z-50 h-full w-full bg-black/50 `}
          onClick={() => {
            setOpen(false);
            resetStore();
          }}
        >
          <motion.div
            className={cn(
              " bg-white dark:bg-neutral-950 border border-transparent dark:border-neutral-800 md:rounded-2xl absolute top-[0.3vh] left-[14vw] z-50 flex flex-col flex-1 overflow-hidden min-w-[80vw] min-h-[90vh] py-6 px-4"
            )}
            initial={{
              opacity: 0,
              scale: 0.5,
              rotateX: 40,
              y: 40,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              rotateX: 0,
              y: 0,
            }}
            exit={{
              opacity: 0,
              scale: 0.8,
              rotateX: 10,
            }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 15,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {children}
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default BookingSuggestionResult;
