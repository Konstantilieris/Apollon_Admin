"use client";
import { STAGE_ENUM, useClientCard } from "@/hooks/use-client-card";
import React, { Suspense, lazy } from "react";

import { AnimatePresence, motion } from "framer-motion";
import BarLoader from "@/components/ui/shuffleLoader";

// Lazy loading components
const LazyClientProfileRow = lazy(() => import("./ClientProfileRow"));
const LazyClientStatsRow = lazy(() => import("./ClientStatsRow"));
const LazyClientFeesRow = lazy(() => import("./ClientFeesRow"));
const LazyClientOverView = lazy(() => import("./ClientOverView"));

const RowRenderer = ({ client }: { client: any }) => {
  const { stage } = useClientCard();

  const renderRow = () => {
    switch (stage) {
      case STAGE_ENUM.INITIAL:
        return <LazyClientProfileRow client={client} />;
      case STAGE_ENUM.STATS:
        return <LazyClientStatsRow client={client} />;
      case STAGE_ENUM.FEES:
        return <LazyClientFeesRow client={client} />;
      case STAGE_ENUM.OVERVIEW:
        return <LazyClientOverView client={client} />;
      default:
        return null;
    }
  };

  return (
    <AnimatePresence mode="wait" key={stage}>
      <Suspense
        fallback={
          <div className="flex h-full w-full items-center justify-center">
            <BarLoader />
          </div>
        }
      >
        <motion.div
          className="flex h-full w-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeIn" }}
        >
          {renderRow()}
        </motion.div>
      </Suspense>
    </AnimatePresence>
  );
};

export default RowRenderer;
