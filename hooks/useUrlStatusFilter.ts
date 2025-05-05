"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { formUrlQuery, removeKeysFromQuery } from "@/lib/utils";

/** keeps ?status=pending|paid|overdue in the URL */
export const useUrlStatusFilter = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [statusFilter, setStatusFilter] = useState(
    searchParams.get("status") ?? "all"
  );

  useEffect(() => {
    let nextUrl = removeKeysFromQuery({
      params: searchParams.toString(),
      keysToRemove: ["page"],
    });

    if (statusFilter === "all") {
      nextUrl = removeKeysFromQuery({
        params: searchParams.toString(),
        keysToRemove: ["status"],
      });
    } else {
      nextUrl = formUrlQuery({
        params: searchParams.toString(),
        key: "status",
        value: statusFilter,
      });
    }
    router.push(nextUrl, { scroll: false });
  }, [statusFilter]);

  return { statusFilter, setStatusFilter };
};
