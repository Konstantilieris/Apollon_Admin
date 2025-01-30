"use client";
import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { IconSearch, IconSquareLetterXFilled } from "@tabler/icons-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import GlobalResult from "./GlobalResult";
import { formUrlQuery, removeKeysFromQuery } from "@/lib/utils";

export const FloatingSearch = () => {
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const debounceTimer = useRef<any | null>(null);

  // 🔹 Open Search on Shortcut SHIFT + Z
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.shiftKey && ["Z", "z"].includes(event.key)) {
        event.preventDefault();
        setIsOpen(true);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);
  // useEffect to reset search term when search bar is closed
  useEffect(() => {
    setSearchTerm("");
  }, [pathname]);

  // 🔹 Debounce API call for better performance
  useEffect(() => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);

    debounceTimer.current = setTimeout(() => {
      if (searchTerm) {
        const newUrl = formUrlQuery({
          params: searchParams.toString(),
          key: "global",
          value: searchTerm,
        });
        router.push(newUrl, { scroll: false });
      } else {
        const newUrl = removeKeysFromQuery({
          params: searchParams.toString(),
          keysToRemove: ["global"],
        });
        router.push(newUrl, { scroll: false });
      }
    }, 300);

    return () => debounceTimer.current && clearTimeout(debounceTimer.current);
  }, [searchTerm, searchParams, pathname, router]);

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Overlay */}
            <motion.div
              className="fixed inset-0 z-[9998] bg-black/60 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />
            {/* Floating Search Modal */}
            <motion.div
              initial={{ opacity: 0, y: -50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -50, scale: 0.9 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className="fixed left-[26vw] top-[3vh] z-[9999] max-h-[80vh] w-[40vw] -translate-x-1/2   rounded-xl bg-white p-4 shadow-lg dark:bg-neutral-900"
              ref={ref}
            >
              <div className="flex w-full items-center justify-center">
                <div className="flex  grow items-center gap-2 self-center">
                  <IconSearch className="h-5 w-5 text-gray-500" />
                  <Input
                    type="text"
                    placeholder="Search..."
                    autoFocus={isOpen}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="min-w-[20vw] grow border-none bg-transparent text-lg outline-none outline-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                  <IconSquareLetterXFilled
                    onClick={() => {
                      setSearchTerm("");
                      setIsOpen(false);
                    }}
                    className="h-5 w-5 cursor-pointer text-gray-500 hover:scale-110"
                  />
                </div>
              </div>
              {/* Search Results */}
              <GlobalResult setIsOpen={setIsOpen} />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
