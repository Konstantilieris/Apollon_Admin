import { motion } from "framer-motion";

import { IconUserFilled, IconCar, IconUser } from "@tabler/icons-react";
import { cn } from "@/lib/utils";

const ToggleWrapper = ({
  taxi,
  setTaxi,
  label,
}: {
  taxi: boolean;
  setTaxi: (value: boolean) => void;
  label: {
    on: string;
    off: string;
  };
}) => {
  return (
    <div className="mt-3 flex flex-col gap-2 pl-4">
      <DarkModeToggle taxi={taxi} setTaxi={setTaxi} />
      <span className="pl-4 text-lg text-light-700">
        {taxi ? label.on : label.off}
      </span>
    </div>
  );
};

const DarkModeToggle = ({
  taxi,
  setTaxi,
}: {
  taxi: boolean;
  setTaxi: (value: boolean) => void;
}) => {
  return (
    <button
      onClick={() => setTaxi(!taxi)}
      className={`relative flex h-[60px] w-28 rounded-lg bg-gradient-to-b p-2 shadow-lg ${
        taxi
          ? "justify-end from-yellow-500 to-dark-100"
          : "justify-start from-indigo-600 to-dark-100"
      }`}
    >
      <Thumb taxi={taxi} />
      {taxi ? <Clouds /> : <Stars />}
    </button>
  );
};

const Thumb = ({ taxi }: { taxi: boolean }) => {
  return (
    <motion.div
      layout
      transition={{
        duration: 0.75,
        type: "spring",
      }}
      className={cn(
        "h-10 w-10 rounded-full overflow-hidden shadow-lg relative p-2",
        {
          "bg-dark-100": taxi,
          "bg-light-900": !taxi,
        }
      )}
    >
      {taxi ? (
        <IconCar size={24} />
      ) : (
        <IconUser size={24} className="text-dark-100" />
      )}
    </motion.div>
  );
};

const Stars = () => {
  return (
    <>
      <motion.span
        animate={{
          scale: [0.75, 1, 0.75],
          opacity: [0.75, 1, 0.75],
        }}
        transition={{
          repeat: Infinity,
          duration: 5,
          ease: "easeIn",
        }}
        className="absolute right-10 top-2 text-xs text-slate-300"
      >
        <IconUserFilled />
      </motion.span>
      <motion.span
        animate={{
          scale: [1, 0.75, 1],
          opacity: [0.5, 0.25, 0.5],
        }}
        transition={{
          repeat: Infinity,
          duration: 3.5,
          ease: "easeIn",
        }}
        style={{ rotate: "-45deg" }}
        className="absolute right-4 top-3 text-lg text-slate-300"
      >
        <IconUserFilled />
      </motion.span>
      <motion.span
        animate={{
          scale: [1, 0.5, 1],
          opacity: [1, 0.5, 1],
        }}
        style={{ rotate: "45deg" }}
        transition={{
          repeat: Infinity,
          duration: 2.5,
          ease: "easeIn",
        }}
        className="absolute right-8 top-8 text-slate-300"
      >
        <IconUserFilled />
      </motion.span>
    </>
  );
};

const Clouds = () => {
  return (
    <>
      <motion.span
        animate={{ x: [-20, -15, -10, -5, 0], opacity: [0, 1, 0.75, 1, 0] }}
        transition={{
          duration: 10,
          repeat: Infinity,
          delay: 0.25,
        }}
        className="absolute left-10 top-1 text-xs text-light-500"
      >
        <IconCar />
      </motion.span>
      <motion.span
        animate={{ x: [-10, 0, 10, 15, 20], opacity: [0, 1, 0.75, 1, 0] }}
        transition={{
          duration: 20,
          repeat: Infinity,
          delay: 0.5,
        }}
        className=" absolute left-4 top-4 text-lg"
      >
        <IconCar className="text-light-500" />
      </motion.span>
      <motion.span
        animate={{ x: [-7, 0, 7, 10, 15], opacity: [0, 1, 0.75, 1, 0] }}
        transition={{
          duration: 12.5,
          repeat: Infinity,
        }}
        className="absolute left-9 top-8 text-white"
      >
        <IconCar className="text-light-500" />
      </motion.span>
      <motion.span
        animate={{ x: [-25, -15, 0, 3, 5], opacity: [0, 1, 0.75, 1, 0] }}
        transition={{
          duration: 25,
          repeat: Infinity,
          delay: 0.75,
        }}
        className="absolute left-14 top-4 text-xs text-white"
      >
        <IconCar className="text-light-500" />
      </motion.span>
    </>
  );
};

export default ToggleWrapper;
