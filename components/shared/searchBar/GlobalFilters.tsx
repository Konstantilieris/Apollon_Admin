"use client";

import { GlobalSearchFilters, formUrlQuery } from "@/lib/utils";
import { IconArrowRight } from "@tabler/icons-react";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";

const GlobalFilters = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const typeParams = searchParams.get("type");

  const [active, setActive] = useState(typeParams || "");
  const handleType = (value: string) => {
    if (active === value) {
      setActive("");
      const newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: "type",
        value: "",
      });
      router.push(newUrl, { scroll: false });
    } else {
      setActive(value);
      const newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: "type",
        value: value.toLowerCase(),
      });
      router.push(newUrl, { scroll: false });
    }
  };

  return (
    <div className="flex flex-row items-center gap-4 ">
      <p className="text-dark400_light900 body-medium flex flex-row items-center gap-2 text-lg">
        ΠΗΓΑΙΝΕ <IconArrowRight size={20} className="text-yellow-400" />{" "}
      </p>
      <div className="flex gap-3">
        {GlobalSearchFilters.map((item) => (
          <button
            key={item.value}
            type="button"
            className={`light-border-2 small-medium :text-light-800 text-dark200_light800 rounded-2xl px-5 py-3 text-[1rem] uppercase hover:scale-105 
              ${
                active === item.value
                  ? "bg-yellow-600 text-light-900"
                  : "bg-light-700 text-dark-400 hover:text-primary-500 dark:bg-dark-500 hover:dark:bg-yellow-700"
              }
            `}
            onClick={() => handleType(item.value)}
          >
            {item.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default GlobalFilters;
