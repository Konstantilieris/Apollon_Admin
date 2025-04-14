// hooks/useUrlFlagFilters.ts
"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { formUrlQuery, removeKeysFromQuery } from "@/lib/utils";

export const useUrlFlagFilters = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const initialFlag1 = searchParams.get("flg1") === "true";
  const initialFlag2 = searchParams.get("flg2") === "true";

  const [flag1, setFlag1] = useState(initialFlag1);
  const [flag2, setFlag2] = useState(initialFlag2);

  useEffect(() => {
    let newUrl = searchParams.toString();

    if (flag1) {
      newUrl = formUrlQuery({ params: newUrl, key: "flg1", value: "true" });
    } else {
      newUrl = removeKeysFromQuery({ params: newUrl, keysToRemove: ["flg1"] });
    }

    if (flag2) {
      newUrl = formUrlQuery({ params: newUrl, key: "flg2", value: "true" });
    } else {
      newUrl = removeKeysFromQuery({ params: newUrl, keysToRemove: ["flg2"] });
    }

    router.push(newUrl, { scroll: false });
  }, [flag1, flag2]);

  return { flag1, setFlag1, flag2, setFlag2 };
};
