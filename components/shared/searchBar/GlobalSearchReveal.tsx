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
  const handleKeyDown = (event: KeyboardEvent) => {
    if (
      event.shiftKey &&
      (event.key === "Z" ||
        event.key === "z" ||
        event.key === "ζ" ||
        event.key === "Ζ")
    ) {
      event.preventDefault();
      controlSearch.start("visible");
    }
  };
  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);
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
    <div className="z-[9999]">
      <AnimatePresence mode="wait">
        <motion.div
          variants={{
            visible: {
              opacity: 1,
              position: "fixed",
              top: 2,
              left: "40%",
              display: "block",
            },
            hidden: {
              opacity: 0,
              position: "absolute",
              display: "none",
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
            className=" relative flex min-w-[16vw] max-w-[35vw] items-center gap-1 rounded-xl border border-white bg-light-700 px-8 py-2 dark:bg-neutral-950 "
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
              className="absolute right-2 h-5 w-5 cursor-pointer text-dark-100 hover:scale-110 dark:text-light-800"
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
    </div>
  );
};
