"use client";
import React from "react";
import Image from "next/image";

import { cn, formUrlQuery, removeKeysFromQuery } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
const ToggleTransport = ({ type }: { type: string }) => {
  const [checked, setChecked] = React.useState(useSearchParams().has(type));

  const router = useRouter();
  const searchParams = useSearchParams();
  const handleFlagUrl = (newChecked: boolean) => {
    if (newChecked) {
      const newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: type,
        value: "true",
      });
      router.push(newUrl, { scroll: false });
    } else if (!newChecked && searchParams.has(type)) {
      const newUrl = removeKeysFromQuery({
        params: searchParams.toString(),
        keysToRemove: [type],
      });
      router.push(newUrl, { scroll: false });
    }
  };
  const handleToggle = () => {
    const newChecked = !checked;
    setChecked(newChecked);
    handleFlagUrl(newChecked);
  };

  return (
    <div
      onClick={() => {
        handleToggle();
      }}
      className={cn(
        "relative min-w-[55px] min-h-[30px] rounded-2xl bg-slate-500 py-[0.1px] flex items-center cursor-pointer self-center",
        {
          "bg-slate-500 opacity-80": !checked,
          "bg-indigo-500 opacity-100 justify-end": checked,
        }
      )}
    >
      <span
        className={cn(
          "rounded-full min-w-[30px] flex relative items-center min-h-[28px]",
          {
            "bg-slate-400 pl-1 ": !checked,
            "bg-indigo-400 justify-end": checked,
          }
        )}
      >
        <Image
          src={"/assets/icons/car.svg"}
          alt="car"
          width={22}
          height={22}
          className=" object-contain transition-transform duration-300 ease-in-out hover:scale-110"
        />
      </span>
    </div>
  );
};

export default ToggleTransport;
