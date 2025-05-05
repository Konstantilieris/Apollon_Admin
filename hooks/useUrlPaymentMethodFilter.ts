"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { formUrlQuery, removeKeysFromQuery } from "@/lib/utils";

/** keeps ?paymentMethod=creditcard|cash|bank in the URL */
export const useUrlPaymentMethodFilter = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // init from URL ─ default “all”
  const [paymentMethodFilter, setPaymentMethodFilter] = useState(
    searchParams.get("paymentMethod") ?? "all"
  );

  useEffect(() => {
    let nextUrl = removeKeysFromQuery({
      params: searchParams.toString(),
      keysToRemove: ["page"], // reset pagination on change
    });

    if (paymentMethodFilter === "all") {
      nextUrl = removeKeysFromQuery({
        params: searchParams.toString(),
        keysToRemove: ["paymentMethod"],
      });
    } else {
      nextUrl = formUrlQuery({
        params: searchParams.toString(),
        key: "paymentMethod",
        value: paymentMethodFilter,
      });
    }
    router.push(nextUrl, { scroll: false });
  }, [paymentMethodFilter]);

  return { paymentMethodFilter, setPaymentMethodFilter };
};
