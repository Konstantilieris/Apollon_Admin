// hooks/useUrlSearchQuery.ts
"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { formUrlQuery, removeKeysFromQuery } from "@/lib/utils";

export const useUrlSearchQuery = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";

  const [searchTerm, setSearchTerm] = useState(query);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      let newUrl = "";

      if (searchTerm) {
        newUrl = formUrlQuery({
          params: searchParams.toString(),
          key: "q",
          value: searchTerm,
        });
      } else {
        newUrl = removeKeysFromQuery({
          params: searchParams.toString(),
          keysToRemove: ["q"],
        });
      }

      // Also remove "page" on search change
      newUrl = removeKeysFromQuery({ params: newUrl, keysToRemove: ["page"] });

      router.push(newUrl, { scroll: false });
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm]);

  return { searchTerm, setSearchTerm };
};
