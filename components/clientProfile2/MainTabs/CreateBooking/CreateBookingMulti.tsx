"use client";

import React from "react";
import { domAnimation, LazyMotion, m } from "framer-motion";

import MultistepSidebar from "./MultiBookingSidebar";

import BookingFirstStage from "./BookingFirstStage";
import BookingSecondStage from "./BookingSecondStage";
import ConfirmationStage from "./ConfirmationStage";

const variants = {
  enter: (direction: number) => ({
    y: direction > 0 ? 30 : -30,
    opacity: 0,
  }),
  center: {
    zIndex: 1,
    y: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    zIndex: 0,
    y: direction < 0 ? 30 : -30,
    opacity: 0,
  }),
};

export default function CreateBookingMulti({ client }: { client: any }) {
  const [[page, direction], setPage] = React.useState([0, 0]);

  const paginate = React.useCallback((newDirection: number) => {
    setPage((prev) => {
      const nextPage = prev[0] + newDirection;

      if (nextPage < 0 || nextPage > 3) return prev;

      return [nextPage, newDirection];
    });
  }, []);

  const onChangePage = React.useCallback((newPage: number) => {
    setPage((prev) => {
      if (newPage < 0 || newPage > 2) return prev;
      const currentPage = prev[0];

      return [newPage, newPage > currentPage ? 1 : -1];
    });
  }, []);

  const onBack = React.useCallback(() => {
    paginate(-1);
  }, [paginate]);

  const onNext = React.useCallback(() => {
    paginate(1);
  }, [paginate]);
  const onReset = React.useCallback(() => {
    setPage([0, 0]);
  }, []);

  const content = React.useMemo(() => {
    let component = null;

    switch (page) {
      case 0:
        component = <BookingFirstStage handleNext={onNext} />;
        break;

      case 1:
        component = (
          <BookingSecondStage
            client={client}
            handleBack={onBack}
            handleNext={onNext}
          />
        );
        break;
      case 2:
        component = (
          <ConfirmationStage
            client={client}
            onBack={onBack}
            onNext={onNext}
            onReset={onReset}
          />
        );
        break;
      default:
        component = <BookingFirstStage handleNext={onNext} />;
        break;
    }

    return (
      <LazyMotion features={domAnimation}>
        <m.div
          key={page}
          animate="center"
          className="col-span-12 "
          custom={direction}
          exit="exit"
          initial="exit"
          transition={{
            y: {
              ease: "backOut",
              duration: 0.35,
            },
            opacity: { duration: 0.4 },
          }}
          variants={variants}
        >
          {component}
        </m.div>
      </LazyMotion>
    );
  }, [direction, page]);

  return (
    <MultistepSidebar
      currentPage={page}
      onBack={onBack}
      onChangePage={onChangePage}
      onNext={onNext}
    >
      {content}
    </MultistepSidebar>
  );
}
