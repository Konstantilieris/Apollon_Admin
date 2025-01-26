"use client";

import React, { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import {
  IconSquareRoundedXFilled,
  IconSquarePlus,
  IconSquareCheckFilled,
  IconNotes,
} from "@tabler/icons-react";

import NoteDogForm from "./Dog/NoteDogForm";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { updateClientNote } from "@/lib/actions/client.action";

export function ClientNoteCard({ client }: { client: any }) {
  const [active, setActive] = useState<any>(null);
  const ref = useRef<HTMLDivElement>(null);
  const id = useId();
  const path = usePathname();
  const [activeForm, setActiveForm] = useState(false);
  const [note, setNote] = useState(client?.notes ? client.notes : "");
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

  const handleNoteClient = async () => {
    try {
      await updateClientNote({
        clientId: client._id,
        note,
        path,
      });
    } catch (error) {
      console.log(error);
      throw error;
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
            className=" fixed inset-0 z-[2000] h-full min-h-[60vh] w-full bg-black/20  md:max-h-[90%]"
            onClick={() => setActive(false)}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {active && typeof active === "object" ? (
          <motion.div
            layoutId={`card-${active.name}-${id}`}
            ref={ref}
            className="fixed left-[28vw] top-[10vh]  z-[2000] flex  h-full  min-h-[60vh]  w-[50vw] flex-col  place-items-center overflow-hidden border border-gray-500 bg-white py-4 dark:bg-neutral-900 sm:rounded-3xl md:h-fit md:max-h-[90%]"
          >
            <motion.div
              layoutId={`image-${active._id}-${id}`}
              className="absolute right-2 top-2"
            >
              <Image
                src={"/assets/icons/client.svg"}
                alt="client"
                width={20}
                height={20}
              />
            </motion.div>

            <div className="min-h-[70vh] w-full">
              <div className="mt-4  flex w-full flex-col items-start gap-4 p-7">
                <div className="flex min-h-[40vh] w-full flex-col  gap-4 rounded-2xl p-2 dark:bg-neutral-800">
                  <div className=" flex w-full flex-row items-center justify-between">
                    <span className="flex items-center gap-2 font-semibold dark:text-yellow-500">
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
                            onClick={handleNoteClient}
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
                      <div className="mb-8 mt-4 h-[2px] w-full animate-pulse rounded-full bg-indigo-300" />
                      <p className="text-neutral-700 dark:text-neutral-200">
                        {active?.notes}
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
        ) : null}
      </AnimatePresence>

      <motion.div
        layoutId={`card-${client?.name}-${id}`}
        key={`card-${client?.name}-${id}`}
        onClick={() => setActive(client)}
        className="relative flex h-full min-h-[15vh] w-full flex-col gap-4 rounded-lg border border-lime-500 p-4  dark:bg-neutral-900 max-md:min-w-[42vw] max-md:pt-8 "
      >
        <motion.div
          className="absolute right-2 top-2"
          layoutId={`image-${client?._id}-${id}`}
        >
          <Image
            src={"/assets/icons/notes.svg"}
            alt="client"
            width={30}
            height={30}
          />
        </motion.div>
        <h1 className="text-2xl font-semibold text-gray-800 dark:text-light-900 max-md:hidden">
          ΣΗΜΕΙΩΣΕΙΣ ΠΕΛΑΤΗ
        </h1>
        <div className="flex w-full flex-col items-start gap-4 text-lg">
          <motion.p
            layoutId={`notes-${client?.notes}-${id}`}
            className="ml-8 flex flex-row items-start gap-2 text-start uppercase text-neutral-600 dark:text-light-800 md:text-left "
          >
            {client?.notes ? client.notes : "Δεν υπάρχουν σημειώσεις"}
          </motion.p>
        </div>
      </motion.div>
    </>
  );
}
