"use client";

import React, { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useOutsideClick } from "@/hooks/use-outside-click";
import {
  IconCpu,
  IconPawFilled,
  IconSquareRoundedXFilled,
  IconSquarePlus,
  IconSquareCheckFilled,
  IconNotes,
} from "@tabler/icons-react";
import { formatDate } from "@/lib/utils";
import NoteDogForm from "./NoteDogForm";
import { usePathname } from "next/navigation";
import { updateClientDogNote } from "@/lib/actions/client.action";
interface dogListProps {
  name: string;
  gender: string;
  birthdate?: Date;
  food?: string;
  breed?: string;
  behavior?: string;
  microchip?: string;
  note: string;
  _id: string;
}

export function DogCards({
  dogs,
  clientId,
}: {
  dogs: dogListProps[];
  clientId: string;
}) {
  const [active, setActive] = useState<any>(null);
  const ref = useRef<HTMLDivElement>(null);
  const id = useId();
  const path = usePathname();
  const [activeForm, setActiveForm] = useState(false);
  const [note, setNote] = useState("");
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setActive(false);
      }
    }

    if (active && typeof active === "object") {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [active]);

  useOutsideClick(ref, () => setActive(null));
  const handleNoteDog = async () => {
    try {
      await updateClientDogNote({
        clientId,
        dogId: active._id,
        note,
        path,
      });
    } catch (e) {
      console.error(e);
    }
  };
  return (
    <>
      <AnimatePresence>
        {active && typeof active === "object" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-10 h-full w-full bg-black/20"
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {active && typeof active === "object" ? (
          <div className="fixed inset-0  z-[100] grid place-items-center">
            <motion.button
              key={`button-${active._id}-${id}`}
              layout
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              exit={{
                opacity: 0,
                transition: {
                  duration: 0.05,
                },
              }}
              className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-white lg:hidden"
              onClick={() => setActive(null)}
            ></motion.button>
            <motion.div
              layoutId={`card-${active.name}-${id}`}
              ref={ref}
              className="relative flex  h-full min-h-[60vh] w-full max-w-[500px]  flex-col overflow-hidden border border-green-400 bg-white py-4 dark:bg-neutral-900 sm:rounded-3xl md:h-fit md:max-h-[90%]"
            >
              <motion.div
                layoutId={`image-${active._id}-${id}`}
                className="absolute right-2 top-2"
              >
                <IconPawFilled className="text-green-400" />
              </motion.div>
              <span className="absolute left-2 top-2 flex flex-row items-center gap-1">
                <IconCpu className="text-green-500" /> {active?.microchip}
              </span>

              <div>
                <div className="mt-4  flex w-full flex-col items-start gap-4 p-7">
                  <div className="flex w-full flex-col gap-4">
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
                      ΡΑΤΣΑ: {active?.breed}
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
          </div>
        ) : null}
      </AnimatePresence>
      <ul className="mx-auto w-full max-w-2xl gap-4">
        {dogs.map((dog, index) => (
          <motion.div
            layoutId={`card-${dog.name}-${id}`}
            key={`card-${dog.name}-${id}`}
            onClick={() => setActive(dog)}
            className="relative mt-3 flex min-h-[15vh] flex-col gap-4 rounded-lg border border-indigo-400 p-4 shadow-sm shadow-MediumPurple dark:bg-neutral-900 max-md:min-w-[42vw] max-md:pt-8"
          >
            <motion.div
              className="absolute right-2 top-2"
              layoutId={`image-${dog._id}-${id}`}
            >
              <IconPawFilled className=" text-indigo-300" />
            </motion.div>
            <h1 className="text-lg font-semibold text-gray-800 dark:text-indigo-300 max-md:hidden">
              ΣΤΟΙΧΕΙΑ ΣΚΥΛΟΥ
            </h1>
            <div className="flex w-full flex-col items-start gap-4 ">
              <div className="flex w-full flex-row justify-between">
                <motion.p
                  layoutId={`name-${dog.name}-${id}`}
                  className="flex flex-row text-center  text-neutral-800 dark:text-light-800"
                >
                  ONOMA: {dog.name}
                </motion.p>
                <motion.p
                  layoutId={`behavior-${dog.behavior}-${id}`}
                  className="text-center uppercase text-neutral-600 dark:text-light-700 md:text-left"
                >
                  ΣΥΜΠΕΡΙΦΟΡΑ: {dog.behavior}
                </motion.p>
              </div>
              <div className="flex w-full flex-row justify-between">
                <motion.p
                  layoutId={`breed-${dog.breed}-${id}`}
                  className="text-center  text-neutral-800 dark:text-light-800 md:text-left"
                >
                  ΡΑΤΣΑ: {dog.breed}
                </motion.p>
                <motion.p
                  layoutId={`gender-${dog.gender}-${id}`}
                  className="text-center uppercase text-neutral-600 dark:text-light-700 md:text-left"
                >
                  ΦΥΛΟ: {dog.gender}
                </motion.p>
              </div>
            </div>
          </motion.div>
        ))}
      </ul>
    </>
  );
}
