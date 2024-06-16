"use client";
import React from "react";
import { useSearchParams, useRouter } from "next/navigation";

import { cn, formUrlQuery, removeKeysFromQuery } from "@/lib/utils";

const CategoryTabItem = ({ main, mainId }: any) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const isActive = searchParams.get("id")
    ? searchParams.get("id") === main._id
    : mainId === main?._id;

  const handleMainChange = () => {
    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      key: "id",
      value: main?._id,
    });

    router.push(newUrl, { scroll: false });
    if (searchParams.get("sub")) {
      const newUrl = removeKeysFromQuery({
        params: searchParams.toString(),
        keysToRemove: ["sub"],
      });
      router.push(newUrl, { scroll: false });
    }
  };

  return (
    <div
      onClick={handleMainChange}
      className={cn(
        `banktab-item hover:scale-105 transition-transform duration-300 ease-in-out`,
        {
          " border-orange-300": isActive,
        }
      )}
    >
      <p
        className={cn(
          `text-16 line-clamp-1 flex-1 font-semibold font-noto_sans text-lg text-dark100_light900 hover:scale-105 transition-transform duration-300 ease-in-out`,
          {
            " text-orange-300 ": isActive,
          }
        )}
      >
        {main.name}
      </p>
    </div>
  );
};

export default CategoryTabItem;
