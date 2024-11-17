"use client";

import React, { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { IconPawFilled } from "@tabler/icons-react";

import { usePathname } from "next/navigation";
import {
  updateClientDogDead,
  updateClientDogNote,
} from "@/lib/actions/client.action";
import AlertDeadDog from "./AlertDeadDog";
import DogNormalView from "./DogNormalView";
import DogEditView from "./DogEditView";
import { calculateAge, formatDate } from "@/lib/utils";

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
  const dialogRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const id = useId();
  const path = usePathname();
  const [activeForm, setActiveForm] = useState(false);
  const [note, setNote] = useState("");
  const [edit, setEdit] = useState(false);

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
  useEffect(() => {
    setNote(active?.note);
  }, [active]);
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
    } finally {
      setActiveForm(false);
      window.location.reload();
    }
  };
  const handleDeadDog = async () => {
    try {
      await updateClientDogDead({
        clientId,
        dogId: active._id,
        path,
      });
    } catch (e) {
      console.error(e);
    } finally {
      setOpen(false);
    }
  };

  return (
    <>
      <AlertDeadDog
        open={open}
        setOpen={setOpen}
        handleDeadDog={handleDeadDog}
        dialogRef={dialogRef}
      />

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
          <div className="fixed inset-0  z-[9000] grid place-items-center">
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
            {edit ? (
              <DogEditView
                active={active}
                setActive={setActive}
                id={id}
                theRef={ref}
                setEdit={setEdit}
                clientId={clientId}
              />
            ) : (
              <DogNormalView
                active={active}
                setActive={setActive}
                setOpen={setOpen}
                id={id}
                note={note}
                setNote={setNote}
                setActiveForm={setActiveForm}
                activeForm={activeForm}
                handleNoteDog={handleNoteDog}
                theRef={ref}
                dialogRef={dialogRef}
                setEdit={setEdit}
              />
            )}
          </div>
        ) : null}
      </AnimatePresence>

      <ul className="mx-auto w-full max-w-2xl flex-1 gap-4">
        {dogs.map((dog, index) => (
          <motion.div
            layoutId={`card-${dog.name}-${id}`}
            key={`card-${dog.name}-${id}`}
            onClick={() => setActive(dog)}
            className="relative mt-3 flex min-h-[15vh] flex-col gap-4 rounded-lg border border-gray-600 p-4 shadow-sm shadow-gray-500 dark:bg-neutral-900 max-md:min-w-[42vw] max-md:pt-8"
          >
            <motion.div
              className="absolute right-2 top-2"
              layoutId={`image-${dog._id}-${id}`}
            >
              <IconPawFilled className=" text-yellow-500" />
            </motion.div>
            <h1 className="text-xl font-semibold text-light-900 max-md:hidden">
              ΣΤΟΙΧΕΙΑ ΣΚΥΛΟΥ
            </h1>
            <div className="flex w-full flex-col items-start gap-4 text-lg ">
              <div className="flex w-full flex-row justify-between">
                <motion.p
                  layoutId={`name-${dog?.name}-${id}`}
                  className="flex flex-row text-center  text-neutral-800 dark:text-light-800"
                >
                  ONOMA: {dog?.name}
                </motion.p>
                <motion.p
                  layoutId={`behavior-${dog?.behavior}-${id}`}
                  className="text-center uppercase text-neutral-600 dark:text-light-700 md:text-left"
                >
                  ΣΥΜΠΕΡΙΦΟΡΑ: {dog?.behavior ? dog?.behavior : "N/A"}
                </motion.p>
              </div>
              <div className="flex w-full flex-row justify-between">
                <motion.p>
                  ΗΛΙΚΙΑ:{" "}
                  {dog.birthdate
                    ? calculateAge(new Date(dog.birthdate))
                    : "N/A"}{" "}
                </motion.p>
                <motion.p
                  layoutId={`birthdate-${dog?.birthdate}-${id}`}
                  className="text-center  text-neutral-800 dark:text-light-800 md:text-left"
                >
                  ΓΕΝΝΗΣΗ:{" "}
                  {dog.birthdate
                    ? formatDate(new Date(dog.birthdate), "el")
                    : "N/A"}
                </motion.p>
              </div>
              <div className="flex w-full flex-row justify-between">
                <motion.p
                  layoutId={`breed-${dog?.breed}-${id}`}
                  className="text-center  text-neutral-800 dark:text-light-800 md:text-left"
                >
                  ΡΑΤΣΑ: {dog?.breed ? dog?.breed : "N/A"}
                </motion.p>
                <motion.p
                  layoutId={`gender-${dog?.gender}-${id}`}
                  className="text-center uppercase text-neutral-600 dark:text-light-700 md:text-left"
                >
                  ΦΥΛΟ: {dog?.gender}
                </motion.p>
              </div>
            </div>
          </motion.div>
        ))}
      </ul>
    </>
  );
}
