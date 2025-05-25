"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { formUrlQuery, removeKeysFromQuery } from "@/lib/utils";

/** keeps ?paid=paid|unpaid in the URL (omit for all) */
export const useUrlPaidFilter = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // initial value from ?paid=… or default to "all"
  const [paidFilter, setPaidFilter] = useState(
    searchParams.get("paid") === "paid" || searchParams.get("paid") === "unpaid"
      ? searchParams.get("paid")!
      : "all"
  );

  useEffect(() => {
    // strip out page on any filter change
    let nextUrl = removeKeysFromQuery({
      params: searchParams.toString(),
      keysToRemove: ["page"],
    });

    if (paidFilter === "all") {
      // remove the paid key entirely
      nextUrl = removeKeysFromQuery({
        params: searchParams.toString(),
        keysToRemove: ["paid"],
      });
    } else {
      // set or replace paid=paidFilter
      nextUrl = formUrlQuery({
        params: searchParams.toString(),
        key: "paid",
        value: paidFilter,
      });
    }

    router.push(nextUrl, { scroll: false });
  }, [paidFilter]);

  return { paidFilter, setPaidFilter };
};
