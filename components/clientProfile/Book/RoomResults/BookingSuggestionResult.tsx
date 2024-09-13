"use client";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import React from "react";

const BookingSuggestionResult = ({ children, stages, isRef }: any) => {
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
          >
            <motion.div
              className={cn(
                "flex-1  flex flex-col gap-2 h-full ml-12 max-w-[90vw] "
              )}
              ref={isRef}
              key={stages}
              initial="initialState"
              animate="animateState"
              exit="exitState"
              transition={{ duration: 0.4, ease: "easeIn" }}
              variants={{
                initialState: {
                  opacity: 0,
                  clipPath: "polygon(50% 0, 50% 0, 50% 100%, 50% 100%)",
                },
                animateState: {
                  opacity: 1,
                  clipPath: "polygon(0 0, 100% 0, 100% 100%, 0% 100%)",
                },
                exitState: {
                  opacity: 0,
                  clipPath: "polygon(50% 0, 50% 0, 50% 100%, 50% 100%)",
                },
              }}
            >
              {children}
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default BookingSuggestionResult;
