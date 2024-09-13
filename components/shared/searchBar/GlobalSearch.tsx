"use client";
import React, { useEffect, useRef, useState } from "react";

import { Input } from "@/components/ui/input";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { formUrlQuery, removeKeysFromQuery } from "@/lib/utils";
import GlobalResult from "./GlobalResult";
import { IconEyeSearch } from "@tabler/icons-react";

const GlobalSearch = () => {
  const router = useRouter();
  const searchContainerRef = useRef(null);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !(searchContainerRef.current as HTMLElement).contains(e.target as Node)
      ) {
        setIsOpen(false);
        setSearchTerm("");
      }
    };
    setIsOpen(false);
    document.addEventListener("click", handleOutsideClick);
    return () => document.removeEventListener("click", handleOutsideClick);
  }, [pathname]);
  useEffect(() => {
    const newUrl = removeKeysFromQuery({
      params: searchParams.toString(),
      keysToRemove: ["global"],
    });
    setSearchTerm("");
    router.push(newUrl, { scroll: false });
  }, [pathname]);
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
    <div
      className="relative w-full max-w-[400px] max-lg:hidden"
      ref={searchContainerRef}
    >
      <div className="relative flex min-h-[56px] grow items-center gap-1 rounded-xl border border-white bg-light-700 px-4  dark:bg-neutral-950">
        <IconEyeSearch size={24} stroke={1.5} className="text-yellow-500" />

        <Input
          type="text"
          placeholder="Αναζήτηση "
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);

            if (!isOpen) setIsOpen(true);
            if (e.target.value === "" && isOpen) setIsOpen(false);
          }}
          className="paragraph-regular no-focus placeholde:text-light-800 text-dark400_light700 border-none bg-transparent shadow-none outline-none"
        />
      </div>
      {isOpen && <GlobalResult />}
    </div>
  );
};
export default GlobalSearch;
