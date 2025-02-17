"use client";
import { STAGE_ENUM, useClientCard } from "@/hooks/use-client-card";
import { motion } from "framer-motion";

interface ChipProps {
  text: string;
  value: STAGE_ENUM;
  selected: boolean;
  setSelected: (value: STAGE_ENUM) => void;
}
const tabs: { label: string; value: STAGE_ENUM }[] = [
  {
    label: "Προφίλ",
    value: STAGE_ENUM.INITIAL,
  },
  { label: "Στατιστικά", value: STAGE_ENUM.STATS },
  { label: "Τιμές", value: STAGE_ENUM.FEES },
  { label: "Πληρωμές", value: STAGE_ENUM.OVERVIEW },
];

const ChipTabs = () => {
  const { stage, setStage } = useClientCard();

  return (
    <div className="flex flex-wrap items-center gap-2   px-4 ">
      {tabs.map((tab) => (
        <Chip
          text={tab.label}
          value={tab.value}
          selected={stage === tab.value}
          setSelected={setStage}
          key={tab.value}
        />
      ))}
    </div>
  );
};

const Chip = ({ text, value, selected, setSelected }: ChipProps) => {
  return (
    <button
      onClick={() => setSelected(value)}
      className={`${
        selected
          ? "text-white"
          : "text-slate-300 hover:bg-neutral-800 hover:text-slate-200"
      } relative w-fit rounded-md px-2.5 py-0.5 text-sm transition-colors`}
    >
      <span className="relative z-10 text-lg">{text}</span>
      {selected && (
        <motion.span
          layoutId="pill-tab"
          transition={{ type: "spring", duration: 0.5 }}
          className="absolute bottom-0 left-3 z-0 h-1 w-3/4 rounded-md bg-gradient-to-r from-yellow-700 to-yellow-600"
        />
      )}
    </button>
  );
};

export default ChipTabs;
