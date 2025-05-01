// hooks/useUrlSearchQuery.ts
"use client";
import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { formUrlQuery, removeKeysFromQuery } from "@/lib/utils";

export const useUrlSearchQuery = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get("query") || "";
  const pathname = usePathname();
  const [searchTerm, setSearchTerm] = useState(query);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      let newUrl;
      if (searchTerm) {
        newUrl = removeKeysFromQuery({
          params: searchParams.toString(),
          keysToRemove: ["page"],
        });

        newUrl = formUrlQuery({
          params: searchParams.toString(),
          key: "query",
          value: searchTerm,
        });
        router.push(newUrl, { scroll: false });
      } else {
        if (query) {
          newUrl = removeKeysFromQuery({
            params: searchParams.toString(),
            keysToRemove: ["query"],
          });
          router.push(newUrl, { scroll: false });
        }
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, searchParams, query, pathname, router]);

  return { searchTerm, setSearchTerm };
};
