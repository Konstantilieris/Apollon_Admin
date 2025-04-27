// hooks/useUrlReversedFilter.ts
"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { formUrlQuery, removeKeysFromQuery } from "@/lib/utils";

export const useUrlReversedFilter = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Initialize from URL
  const initialReversed = (() => {
    const raw = searchParams.get("reversed");
    if (raw === "true") return "reversed";
    if (raw === "false") return "notReversed";
    return undefined;
  })();

  const [reversedFilter, setReversedFilter] = useState<
    "reversed" | "notReversed" | undefined
  >(initialReversed);

  useEffect(() => {
    if (reversedFilter === undefined) return;

    let newUrl;
    newUrl = removeKeysFromQuery({
      params: searchParams.toString(),
      keysToRemove: ["page"],
    });
    if (reversedFilter === "reversed") {
      newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: "reversed",
        value: "true",
      });
    } else if (reversedFilter === "notReversed") {
      newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: "reversed",
        value: "false",
      });
    } else {
      newUrl = removeKeysFromQuery({
        params: searchParams.toString(),
        keysToRemove: ["reversed"],
      });
    }

    router.push(newUrl, { scroll: false });
  }, [reversedFilter]);

  return { reversedFilter, setReversedFilter };
};
