"use client";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import { cn, formUrlQuery, removeKeysFromQuery } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { IconSearch, IconSquareLetterXFilled } from "@tabler/icons-react";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

import GlobalResult from "./GlobalResult";

export const FloatingSearch = ({ className }: { className?: string }) => {
  const controlSearch = useAnimation();
  const ref = React.useRef(null);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState("");
  const controlResult = useAnimation();
  const [stage, setStage] = useState(false);
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      const topThreshold = 25; // Top area in px
      const centerThreshold = window.innerWidth / 10; // Define "center"

      // Check if cursor is within top 100px and horizontally centered
      const isInTopCenter =
        event.clientY <= topThreshold &&
        event.clientX >= window.innerWidth / 2 - centerThreshold &&
        event.clientX <= window.innerWidth / 2 + centerThreshold;

      if (isInTopCenter) {
        controlSearch.start("visible");
      }
    };

    // Add event listener
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      // Clean up event listener
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [controlSearch]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchTerm) {
        const newUrl = formUrlQuery({
          params: searchParams.toString(),
          key: "global",
          value: searchTerm,
        });
        router.push(newUrl, { scroll: false });
      }
    }, 300);
    if (searchTerm === "") {
      const newUrl = removeKeysFromQuery({
        params: searchParams.toString(),
        keysToRemove: ["global"],
      });
      router.push(newUrl, { scroll: false });
    }

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, searchParams, pathname, router]);

  return (
    <>
      <AnimatePresence mode="wait">
        <motion.div
          variants={{
            visible: {
              opacity: 1,
              position: "fixed",
              top: 2,
              left: "40%",
            },
            hidden: {
              opacity: 0,
              position: "absolute",
              top: 1,
              left: -400,
            },
          }}
          initial="hidden"
          animate={controlSearch}
          transition={{ duration: 0.5, ease: "easeInOut", type: "spring" }}
          className={cn(" z-50  py-2   px-4", className)}
        >
          <motion.div
            ref={ref}
            className=" flex min-w-[16vw] max-w-[35vw] items-center gap-1 rounded-xl border border-white bg-light-700 px-8 py-2 dark:bg-neutral-950 relative "
          >
            <IconSearch className="h-5 w-5 text-dark-100 dark:text-light-800" />
            <Input
              type="text"
              placeholder="Αναζήτηση"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                !stage && setStage(true);
                controlResult.start("visible");
              }}
              className="paragraph-regular no-focus border-none bg-transparent shadow-none outline-none placeholder:text-light-800 dark:text-light-900"
            />
            <IconSquareLetterXFilled
              onClick={() => {
                setSearchTerm("");
                controlSearch.start("hidden");
              }}
              className="h-5 w-5 text-dark-100 dark:text-light-800 cursor-pointer absolute right-2 hover:scale-110"
            />
          </motion.div>
        </motion.div>
        {stage && (
          <motion.div
            variants={{
              visible: {
                opacity: 1,
                position: "fixed",
                top: "6%",
                left: "20%",
              },
              hidden: {
                opacity: 0,
                position: "absolute",
                top: 1,
                left: -400,
              },
            }}
            initial="hidden"
            animate={controlResult}
            transition={{ duration: 0.5, ease: "easeInOut", type: "spring" }}
            className={cn(" z-50  py-2   px-4 ", className)}
          >
            <GlobalResult
              control={controlResult}
              setStage={setStage}
              controlSearch={controlSearch}
              searchRef={ref}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
