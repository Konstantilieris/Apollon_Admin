"use client";
import React, { useEffect, useId, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useOutsideClick } from "@/hooks/use-outside-click";
import { getDayAndMonth } from "@/lib/utils";
import Link from "next/link";

interface OccupiedBedProps {
  clientName: string;
  clientId: string;
  dogName: string;
  fromDate: string;
  toDate: string;
}

interface ExpandableCardProps {
  data: OccupiedBedProps | null;
}

export function ExpandableCard({ data }: ExpandableCardProps) {
  const [active, setActive] = useState<OccupiedBedProps | null>(null);
  const id = useId();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setActive(null);
      }
    }

    if (active) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [active]);

  useOutsideClick(ref, () => setActive(null));

  return (
    <>
      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-10 h-full w-full bg-black/20"
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {active ? (
          <div className="fixed inset-0 z-[100] grid place-items-center">
            <motion.div
              layoutId={`card-${active.clientName}-${id}`}
              ref={ref}
              className="flex h-full w-full max-w-[500px] flex-col overflow-hidden bg-light-700 dark:bg-dark-200 sm:rounded-3xl md:h-fit md:max-h-[90%]"
            >
              <div className="flex flex-col items-start justify-between p-4">
                <div>
                  <motion.div layoutId={`image-${active.clientName}-${id}`}>
                    <Image
                      priority
                      width={200}
                      height={200}
                      src={"/assets/images/dogInBed.webp"}
                      alt={"doginBed"}
                      className="h-80 w-full object-cover object-top sm:rounded-t-lg lg:h-80"
                    />
                  </motion.div>
                  <motion.h3
                    layoutId={`title-${active.clientName}-${id}`}
                    whileHover={{ scale: 1.1, color: "blue" }}
                    className=" text-base font-semibold text-dark-100 dark:text-light-800"
                  >
                    <Link href={`/clients/${active.clientId}`}>
                      Πελάτης: {active.clientName}
                    </Link>
                  </motion.h3>
                  <motion.p
                    layoutId={`description-${active.dogName}-${id}`}
                    className="text-base text-dark-200 dark:text-light-700"
                  >
                    Σκύλος : {active.dogName}
                  </motion.p>
                  <motion.p
                    layoutId={`date-range-${active.fromDate}-${active.toDate}-${id}`}
                    className="text-base text-neutral-600 dark:text-light-500"
                  >
                    ΑΠΟ: {getDayAndMonth(new Date(active.fromDate))} - ΜΕΧΡΙ:{" "}
                    {getDayAndMonth(new Date(active.toDate))}
                  </motion.p>
                </div>
              </div>
              <motion.button
                layoutId={`button-${active.clientName}-${id}`}
                className="mt-4 rounded-lg bg-purple-300 px-4 py-2 text-sm font-bold text-dark-100 hover:bg-red-800 dark:bg-purple-800  dark:text-light-700  md:mt-0"
                onClick={() => setActive(null)}
              >
                Κλείσιμο Καρτέλας
              </motion.button>
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>

      {data && (
        <motion.div
          key={data.clientName}
          onClick={() => setActive(data)}
          className="flex h-full w-full cursor-pointer flex-col items-center justify-center gap-2 p-1 font-sans hover:bg-red-700"
        >
          <div className="flex flex-col items-center justify-center">
            <motion.h3
              layoutId={`title-${data.clientName}-${id}`}
              className="flex items-center text-center font-semibold text-light-800 md:text-left"
            >
              <Image
                src={"/assets/icons/client.svg"}
                alt="client"
                height={30}
                width={30}
              />{" "}
              {data.clientName}
            </motion.h3>
            <motion.p
              layoutId={`description-${data.dogName}-${id}`}
              className="mt-2 flex flex-row items-center gap-2 text-center text-base font-semibold text-light-700  md:text-left"
            >
              {" "}
              <Image
                src={"/assets/icons/dog.svg"}
                alt="dog"
                height={30}
                width={30}
              />
              {data.dogName}
            </motion.p>
          </div>
        </motion.div>
      )}
    </>
  );
}
