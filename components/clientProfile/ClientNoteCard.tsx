"use client";

import React, { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useOutsideClick } from "@/hooks/use-outside-click";
import {
  IconMailOpened,
  IconSquareRoundedXFilled,
  IconSquarePlus,
  IconSquareCheckFilled,
  IconNotes,
} from "@tabler/icons-react";

import NoteDogForm from "./NoteDogForm";
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

  useOutsideClick(ref, () => setActive(null));
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
                <Image
                  src={"/assets/icons/client.svg"}
                  alt="client"
                  width={20}
                  height={20}
                />
              </motion.div>

              <div className="min-h-[70vh]">
                <div className="mt-4  flex w-full flex-col items-start gap-4 p-7">
                  <div className="flex w-full flex-col gap-4">
                    <motion.h3
                      layoutId={`email-${active.email}-${id}`}
                      className="font-bold text-neutral-700 dark:text-neutral-200"
                    >
                      EMAIL: {active?.email ? active.email : "N/A"}
                    </motion.h3>
                    <motion.p
                      layoutId={`profession-${active.profession}-${id}`}
                      className="text-neutral-700 dark:text-neutral-200"
                    >
                      ΕΠΑΓΓΕΛΜΑ: {active?.profession}
                    </motion.p>
                    <motion.h3
                      layoutId={`training-${active.isTraining}-${id}`}
                      className=" text-neutral-700 dark:text-neutral-200"
                    >
                      ΕΚΠΑΙΔΕΥΣΗ: {active?.isTraining ? "ΝΑΙ" : "ΟΧΙ"}
                    </motion.h3>
                  </div>
                  <div className="flex min-h-[40vh] w-full flex-col  gap-4 rounded-2xl p-2 dark:bg-neutral-800">
                    <div className=" flex w-full flex-row items-center justify-between">
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
          </div>
        ) : null}
      </AnimatePresence>

      <motion.div
        layoutId={`card-${client?.name}-${id}`}
        key={`card-${client?.name}-${id}`}
        onClick={() => setActive(client)}
        className="relative flex min-h-[15vh]  w-full flex-col gap-4 rounded-lg border border-indigo-400 p-4 shadow-sm shadow-MediumPurple dark:bg-neutral-900 max-md:min-w-[42vw] max-md:pt-8"
      >
        <motion.div
          className="absolute right-2 top-2"
          layoutId={`image-${client?._id}-${id}`}
        >
          <Image
            src={"/assets/icons/client.svg"}
            alt="client"
            width={20}
            height={20}
          />
        </motion.div>
        <h1 className="text-lg font-semibold text-gray-800 dark:text-indigo-300 max-md:hidden">
          ΠΡΟΣΩΠΙΚΑ ΣΤΟΙΧΕΙΑ
        </h1>
        <div className="flex w-full flex-col items-start gap-4 ">
          <div className="flex w-full flex-row justify-between">
            <motion.p
              layoutId={`email-${client?.email}-${id}`}
              className="flex flex-row gap-2  text-center text-neutral-800 dark:text-light-800"
            >
              EMAIL:{"  "}
              <span className=" text-indigo-300">
                {client?.email ? client?.email : "N/A"}
              </span>
            </motion.p>
            <motion.p
              layoutId={`profession-${client?.profession}-${id}`}
              className="gap-4 text-center uppercase text-neutral-600 dark:text-light-700 md:text-left"
            >
              ΕΠΑΓΓΕΛΜΑ:{" "}
              <span className="text-indigo-300">{client?.profession}</span>
            </motion.p>
          </div>
          <div className="flex w-full flex-row justify-between">
            <motion.p
              layoutId={`training-${client?.isTraining}-${id}`}
              className="text-center  text-neutral-800 dark:text-light-800 md:text-left"
            >
              ΕΚΠΑΙΔΕΥΣΗ:{"   "}
              <span className="dark:text-indigo-300">
                {client?.isTraining ? "ΝΑΙ" : "ΟΧΙ"}
              </span>
            </motion.p>
            <motion.p
              layoutId={`notes-${client?.notes}-${id}`}
              className="flex flex-row items-center gap-2 text-center uppercase text-neutral-600 dark:text-light-700 md:text-left"
            >
              ΣΗΜΕΙΩΣΕΙΣ:{" "}
              {client?.notes ? (
                <IconMailOpened className="text-indigo-400" />
              ) : (
                <IconSquareRoundedXFilled className="text-indigo-500" />
              )}
            </motion.p>
          </div>
        </div>
      </motion.div>
    </>
  );
}