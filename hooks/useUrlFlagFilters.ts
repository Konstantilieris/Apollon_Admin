// hooks/useUrlFlagFilters.ts
"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { formUrlQuery, removeKeysFromQuery } from "@/lib/utils";

export const useUrlFlagFilters = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const initialFlag1 = searchParams.get("flag1") === "true";
  const initialFlag2 = searchParams.get("flag2") === "true";

  const [flag1, setFlag1] = useState(initialFlag1);
  const [flag2, setFlag2] = useState(initialFlag2);

  useEffect(() => {
    let newUrl;

    if (flag1) {
      newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: "flag1",
        value: "true",
      });
    } else {
      newUrl = removeKeysFromQuery({
        params: searchParams.toString(),
        keysToRemove: ["flag1"],
      });
    }

    router.push(newUrl, { scroll: false });
  }, [flag1]);

  useEffect(() => {
    let newUrl;

    if (flag2) {
      newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: "flag2",
        value: "true",
      });
    } else {
      newUrl = removeKeysFromQuery({
        params: searchParams.toString(),
        keysToRemove: ["flag2"],
      });
    }

    router.push(newUrl, { scroll: false });
  }, [flag2]);

  return { flag1, setFlag1, flag2, setFlag2 };
};
