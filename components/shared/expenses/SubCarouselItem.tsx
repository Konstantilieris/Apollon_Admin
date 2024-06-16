"use client";
import { formUrlQuery, removeKeysFromQuery } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";

const SubCarouselItem = ({ sub }: any) => {
  const [open, setOpen] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const subFilter = searchParams.get("sub");
  const handleClick = () => {
    if (subFilter === sub._id) {
      const newUrl = removeKeysFromQuery({
        params: searchParams.toString(),
        keysToRemove: ["sub"],
      });
      router.push(newUrl, { scroll: false });
    } else {
      const newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: "sub",
        value: sub._id,
      });

      router.push(newUrl, { scroll: false });
    }
  };

  return (
    <>
      {open && (
        <div className="absolute right-20 top-10 z-50     text-[8px] italic text-light-500 dark:text-light-700">
          {" "}
          {sub.name}{" "}
        </div>
      )}
      <span
        className=" my-1 ml-7 flex h-10 w-10 items-center justify-center  rounded-full text-xl  shadow-sm shadow-purple-400 hover:scale-110"
        style={{ backgroundColor: sub.color }}
        key={sub._id}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onClick={handleClick}
      >
        {sub.icon}
      </span>
    </>
  );
};

export default SubCarouselItem;
