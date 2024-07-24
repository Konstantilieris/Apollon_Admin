"use client";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import GlobalSearch from "./GlobalSearch";

import { IconEyeSearch } from "@tabler/icons-react";

export const FloatingSearch = ({ className }: { className?: string }) => {
  const [visible, setVisible] = useState(false);
  const [iconReveal, setIconReveal] = useState(false);
  useEffect(() => {
    const handlePointerMove = (event: PointerEvent) => {
      if (event.clientY < 50) {
        // Check if pointer is within 50px from the top
        setIconReveal(true);
      } else {
        setIconReveal(false);
      }
    };

    window.addEventListener("pointermove", handlePointerMove);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
    };
  }, []);

  return (
    <>
      <AnimatePresence mode="wait">
        {visible && (
          <motion.div
            onDoubleClick={() => setVisible(false)}
            initial={{
              opacity: 1,
              y: -100,
            }}
            animate={{
              y: visible ? -40 : -100,
              opacity: visible ? 1 : 0,
            }}
            transition={{
              duration: 0.2,
            }}
            className={cn(
              "flex max-w-fit  fixed top-10 inset-x-0 mx-auto  z-50",
              className
            )}
          >
            <GlobalSearch />
          </motion.div>
        )}
      </AnimatePresence>
      {!visible && iconReveal && (
        <motion.div
          initial={{ opacity: 0, y: -100 }}
          animate={{ opacity: 1, y: -30 }}
          transition={{ duration: 0.2 }}
          className={cn(
            "flex max-w-fit fixed top-10 inset-x-0 mx-auto z-[5000] items-center justify-center",
            className
          )}
        >
          <IconEyeSearch
            size={35}
            stroke={1.5}
            className="cursor-pointer text-neutral-800  dark:text-neutral-200"
            onClick={() => {
              setVisible(true);
            }}
          />
        </motion.div>
      )}
    </>
  );
};
