"use client";

import { motion } from "framer-motion";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import {
  IconRosetteDiscountCheckFilled,
  IconRosetteDiscountCheckOff,
} from "@tabler/icons-react";
import { useRouter, useSearchParams } from "next/navigation";
import { formUrlQuery } from "@/lib/utils";

type ToggleOptionsType = "valid" | "paid";

const OPTIONS = [
  {
    value: "valid" as ToggleOptionsType,
    label: "Οφειλές",
    icon: IconRosetteDiscountCheckFilled,
    // Colors for selected & non-selected states
    activeColor: "text-white",
    inactiveColor: "text-slate-300",
  },
  {
    value: "paid" as ToggleOptionsType,
    label: "Πληρωμένες",
    icon: IconRosetteDiscountCheckOff,
    activeColor: "text-white",
    inactiveColor: "text-green-500",
  },
];

// Reusable classes for each button
const TOGGLE_CLASSES =
  "text-base font-medium flex items-center gap-2 px-3 md:pl-3 md:pr-3.5 py-3 md:py-4 transition-colors relative z-10";

export default function ServiceTabPaid() {
  const [selected, setSelected] = useState<ToggleOptionsType>("valid");
  const searchParams = useSearchParams();
  const router = useRouter();

  // Update the URL based on the selected toggle
  useEffect(() => {
    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      key: "paid",
      value: selected === "paid" ? "true" : "false",
    });
    // If you don't want the back button to be cluttered, consider router.replace
    router.push(newUrl, { scroll: false });
  }, [selected, searchParams, router]);

  return <SliderToggle selected={selected} setSelected={setSelected} />;
}

function SliderToggle({
  selected,
  setSelected,
}: {
  selected: ToggleOptionsType;
  setSelected: Dispatch<SetStateAction<ToggleOptionsType>>;
}) {
  return (
    <div className="relative flex w-fit items-center gap-4 rounded-xl">
      {OPTIONS.map(
        ({ value, label, icon: Icon, activeColor, inactiveColor }) => {
          const isActive = selected === value;
          return (
            <button
              key={value}
              className={`${TOGGLE_CLASSES} ${
                isActive ? activeColor : inactiveColor
              }`}
              onClick={() => setSelected(value)}
            >
              <Icon className="relative z-10 text-lg md:text-sm" />
              <span className="relative z-10">{label}</span>
            </button>
          );
        }
      )}

      <div
        className={`absolute inset-0 z-0 flex ${
          selected === "paid" ? "justify-end" : "justify-start"
        }`}
      >
        <motion.span
          layout
          transition={{ type: "spring", damping: 15, stiffness: 250 }}
          className="h-full w-1/2 rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600"
        />
      </div>
    </div>
  );
}
