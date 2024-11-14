"use client";
import React, { useEffect, useId, useMemo, useRef, useState } from "react";

import { AnimatePresence, motion } from "framer-motion";
import { useOutsideClick } from "@/hooks/use-outside-click";
import { getDayAndMonth } from "@/lib/utils";
import Link from "next/link";

import {
  IconLetterKSmall,
  IconLayoutBottombarExpandFilled,
  IconLetterK,
  IconUser,
  IconCalendarWeek,
  IconUsersGroup,
  IconMoneybag,
} from "@tabler/icons-react";
import { DogTooltip } from "../../Dog/DogToolTip";

export function BookingCard({ booking }: any) {
  const [active, setActive] = useState<any>(null);
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

  const dateFrom = useMemo(
    () => getDayAndMonth(new Date(booking.fromDate)),
    [booking.fromDate]
  );

  const dateTo = useMemo(
    () => getDayAndMonth(new Date(booking.toDate)),
    [booking.toDate]
  );
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
          <div className="fixed inset-0 z-[100] grid place-items-center text-light-800">
            <motion.div
              layoutId={`card-${active.clientName}-${id}`}
              ref={ref}
              className="relative flex h-full w-full max-w-[40vw]  flex-col overflow-hidden bg-light-700 p-2 dark:bg-blue-700 sm:rounded-3xl md:h-fit md:max-h-[90%]"
            >
              <motion.div
                layoutId={`image-${active.bookingId}-${id}`}
                className="absolute left-1 top-1 flex flex-row items-center font-bold "
              >
                <IconLetterK size={40} className="text-yellow-500 " />
                ΡΑΤΗΣΗ
              </motion.div>
              <span className="absolute right-2 top-2 flex flex-row items-center gap-2 font-bold text-green-200">
                <IconMoneybag size={30} />
                {active.totalAmount} €
              </span>
              <div className="mt-8 flex flex-col items-start justify-between gap-2 p-4">
                <motion.h3
                  whileHover={{ scale: 1.1, color: "yellow" }}
                  className=" text-base font-semibold uppercase text-dark-100 dark:text-light-800"
                >
                  <Link
                    href={`/clients/${active.clientId}`}
                    className="flex flex-row items-center gap-2"
                  >
                    <IconUser size={30} /> ΠΕΛΑΤΗΣ: {active.clientName}
                  </Link>
                </motion.h3>
                <motion.p
                  layoutId={`description-${active.dogName}-${id}`}
                  className="flex flex-row items-center gap-2 text-base uppercase text-dark-200 dark:text-light-900"
                >
                  <IconUsersGroup size={30} />
                  ΣΚΥΛΟΙ :{" "}
                  {active.dogs.map((dog: any) => dog.dogName).join(", ")}
                </motion.p>
                <motion.p
                  layoutId={`dates-${active.bookingId}-${id}`}
                  className="flex flex-row items-center gap-2 text-base text-neutral-600 dark:text-light-900"
                >
                  <IconCalendarWeek size={30} /> ΗΜΕΡΟΜΗΝΙΕΣ: {dateFrom} -{" "}
                  {dateTo}
                </motion.p>
              </div>
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>

      <motion.div
        key={booking.bookingId}
        className="relative mr-2 mt-1 flex w-1/6   rounded-lg bg-blue-700 p-4  text-light-700"
      >
        <motion.div
          layoutId={`image-${booking.bookingId}-${id}`}
          className="absolute left-0 top-0 flex flex-row items-center "
        >
          <IconLetterKSmall size={45} />
        </motion.div>
        <IconLayoutBottombarExpandFilled
          size={30}
          className="absolute right-2 top-2 text-yellow-500 hover:scale-110"
          onClick={() => setActive(booking)}
        />
        <motion.h3
          layoutId={`dates-${booking.bookingId}-${id}`}
          className=" absolute bottom-0 right-2  font-semibold"
        >
          {dateFrom} - {dateTo}
        </motion.h3>
        <motion.div
          layoutId={`dogs-${booking.bookingId}-${id}`}
          className="flex w-full items-center justify-center"
        >
          <DogTooltip items={booking.dogs} />
        </motion.div>
      </motion.div>
    </>
  );
}
