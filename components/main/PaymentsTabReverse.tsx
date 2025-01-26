import { motion } from "framer-motion";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

import {
  IconRosetteDiscountCheckFilled,
  IconRosetteDiscountCheckOff,
} from "@tabler/icons-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { formUrlQuery } from "@/lib/utils";

const TOGGLE_CLASSES =
  "text-base font-medium flex items-center gap-2 px-3 md:pl-3 md:pr-3.5 py-3 md:py-4 transition-colors relative z-10";

type ToggleOptionsType = "valid" | "reversed";

const PaymentsTabReverse = () => {
  const [selected, setSelected] = useState<ToggleOptionsType>("valid");

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathName = usePathname();
  // useEffect to update params in URL
  useEffect(() => {
    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      key: "reverse",
      value: selected === "reversed" ? "true" : "false",
    });
    router.push(newUrl, { scroll: false });
  }, [selected]);
  // on pathname change reset url params
  useEffect(() => {
    setSelected("valid");
  }, [pathName]);

  return <SliderToggle selected={selected} setSelected={setSelected} />;
};

const SliderToggle = ({
  selected,
  setSelected,
}: {
  selected: ToggleOptionsType;
  setSelected: Dispatch<SetStateAction<ToggleOptionsType>>;
}) => {
  return (
    <div className="relative flex w-fit items-center gap-4 rounded-xl">
      <button
        className={`${TOGGLE_CLASSES} ${
          selected === "valid" ? "text-white" : "text-slate-300"
        }`}
        onClick={() => {
          setSelected("valid");
        }}
      >
        <IconRosetteDiscountCheckFilled className="relative z-10 text-lg md:text-sm" />
        <span className="relative z-10">Έγκυρες</span>
      </button>
      <button
        className={`${TOGGLE_CLASSES} ${
          selected === "reversed" ? "text-white" : "text-red-500"
        }`}
        onClick={() => {
          setSelected("reversed");
        }}
      >
        <IconRosetteDiscountCheckOff className="relative z-10 text-lg md:text-sm" />
        <span className="relative z-10">Ακυρωμένες</span>
      </button>
      <div
        className={`absolute inset-0 z-0 flex  ${
          selected === "reversed" ? "justify-end" : "justify-start"
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
};

export default PaymentsTabReverse;
