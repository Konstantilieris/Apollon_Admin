import { formatDate } from "@/lib/utils";
import {
  IconCpu,
  IconEdit,
  IconNotes,
  IconSkull,
  IconSquareCheckFilled,
  IconSquarePlus,
  IconSquareRoundedXFilled,
} from "@tabler/icons-react";
import { motion } from "framer-motion";
import React from "react";
import NoteDogForm from "./NoteDogForm";
import { useOutsideClick } from "@/hooks/use-outside-click";

interface DogNormalViewProps {
  active: any;
  setActive: (active: any) => void;
  setOpen: (open: boolean) => void;
  id: string;
  note: string;
  setNote: (note: string) => void;
  setActiveForm: (activeForm: boolean) => void;
  activeForm: boolean;
  handleNoteDog: () => void;
  theRef: React.RefObject<HTMLDivElement>;
  dialogRef: React.RefObject<HTMLDivElement>;
  setEdit: (edit: boolean) => void;
}
const DogNormalView = ({
  active,
  setActive,
  setOpen,
  id,
  note,
  setNote,
  setActiveForm,
  activeForm,
  handleNoteDog,
  theRef,
  dialogRef,
  setEdit,
}: DogNormalViewProps) => {
  useOutsideClick(theRef, () => {
    if (!dialogRef.current?.contains(document.activeElement)) {
      setActive(null);
    }
  });
  return (
    <motion.div
      layoutId={`card-${active.name}-${id}`}
      ref={theRef}
      className="relative flex  h-full min-h-[80vh] w-full min-w-[50vw] max-w-[500px]  flex-col overflow-hidden border border-green-400 bg-white py-4 dark:bg-neutral-900 sm:rounded-3xl md:h-fit md:max-h-[90%]"
    >
      <motion.div
        layoutId={`image-${active._id}-${id}`}
        className="absolute right-2 top-2"
      >
        <IconEdit className="text-green-400" onClick={() => setEdit(true)} />
      </motion.div>
      <span className="absolute left-2 top-2 flex flex-row items-center gap-1">
        <IconCpu className="text-green-500" /> {active?.microchip}
      </span>
      <IconSkull
        className="absolute bottom-2 right-2 h-8 w-8 text-red-500 hover:scale-110"
        onClick={() => setOpen(true)}
      />

      <div>
        <div className="mt-4  flex w-full flex-col items-start gap-4 p-7 text-lg">
          <div className="flex w-full flex-col gap-4 ">
            <motion.h3
              layoutId={`name-${active.name}-${id}`}
              className="font-bold text-neutral-700 dark:text-neutral-200"
            >
              ΟΝΟΜΑ: {active?.name}
            </motion.h3>
            <motion.p
              layoutId={`behavior-${active.behavior}-${id}`}
              className="text-neutral-700 dark:text-neutral-200"
            >
              ΣΥΜΠΕΡΙΦΟΡΑ: {active?.behavior}
            </motion.p>
            <motion.h3
              layoutId={`breed-${active.breed}-${id}`}
              className=" text-neutral-700 dark:text-neutral-200"
            >
              ΡΑΤΣΑ: {active?.breed ? active?.breed : "Ν/Α"}
            </motion.h3>
            <motion.p
              layoutId={`gender-${active.gender}-${id}`}
              className="text-neutral-700 dark:text-neutral-200"
            >
              ΦΥΛΟ: {active?.gender}
            </motion.p>
            <p className="text-neutral-700 dark:text-neutral-200">
              ΤΡΟΦΗ: {active?.food}
            </p>
            <p className="text-neutral-700 dark:text-neutral-200">
              ΓΕΝΝΗΣΗ: {formatDate(new Date(active?.birthdate), "el")}
            </p>
            <p className="text-neutral-700 dark:text-neutral-200">
              ΣΤΕΙΡΩΜΕΝΟ: {active.sterilized ? "ΝΑΙ" : "ΟΧΙ"}
            </p>
          </div>
          <div className="flex h-full w-full flex-col justify-between gap-4 rounded-2xl p-2 dark:bg-neutral-800">
            <div className="flex  w-full flex-row items-center justify-between ">
              <span className="flex items-center gap-2 font-semibold text-indigo-300">
                <IconNotes />
                <h1>ΣΗΜΕΙΩΣΕΙΣ</h1>
              </span>
              <p className="flex flex-row">
                {activeForm ? (
                  <>
                    <IconSquareRoundedXFilled
                      className="text-red-500 hover:scale-110"
                      onClick={() => setActiveForm(false)}
                    />
                    <IconSquareCheckFilled
                      className="text-green-500 hover:scale-110"
                      onClick={handleNoteDog}
                    />
                  </>
                ) : (
                  <IconSquarePlus
                    onClick={() => setActiveForm(true)}
                    className="text-green-500 hover:scale-110"
                  />
                )}
              </p>
            </div>
            {activeForm ? (
              <NoteDogForm note={note} setNote={setNote} />
            ) : (
              <div className="flex flex-col items-center gap-2">
                <div className="h-[2px] w-full animate-pulse rounded-full bg-indigo-300" />
                <p className="text-neutral-700 dark:text-neutral-200">
                  {active?.note}
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="relative px-4 pt-4">
          <motion.div
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex h-40 flex-col items-start gap-4 overflow-auto pb-10 text-xs text-neutral-600 [-ms-overflow-style:none] [-webkit-overflow-scrolling:touch] [mask:linear-gradient(to_bottom,white,white,transparent)] [scrollbar-width:none] dark:text-neutral-400 md:h-fit md:text-sm lg:text-base"
          >
            {typeof active.content === "function"
              ? active.content()
              : active.content}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default DogNormalView;
