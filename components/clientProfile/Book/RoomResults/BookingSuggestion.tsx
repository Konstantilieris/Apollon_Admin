/* eslint-disable no-unused-vars */
"use client";
import React, { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";

import BookingSuggestionResult from "./BookingSuggestionResult";

import { IconLoader } from "@tabler/icons-react";

import SteppedProgress from "@/components/ui/BookingProgress";

interface BookingProps {
  client: any;

  setOpen: (open: boolean) => void;
}
const BookingSuggestion = ({ client, setOpen }: BookingProps) => {
  const [loading, setLoading] = React.useState(false);

  const ref = useRef(null);

  if (loading) {
    return (
      <AnimatePresence>
        <>
          {/* Background overlay */}
          <motion.div
            className="fixed left-0 top-0 z-30 h-full w-full bg-dark-100/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          <motion.span
            className="fixed  left-[50vw] top-[40vh] z-50  rounded-xl text-2xl  "
            style={{ color: "#FFD700" }}
            initial={{ opacity: 0.4 }}
            animate={{ opacity: 1 }}
            transition={{
              duration: 2,
              ease: "easeIn",
              repeat: Infinity,
              repeatDelay: 1,
              repeatType: "reverse",
            }}
          >
            <IconLoader size={60} className="animate-spin" />
          </motion.span>
        </>
      </AnimatePresence>
    );
  }
  if (!loading) {
    return (
      <BookingSuggestionResult isRef={ref} setOpen={setOpen}>
        <SteppedProgress client={client} />
      </BookingSuggestionResult>
    );
  }
};

export default BookingSuggestion;
