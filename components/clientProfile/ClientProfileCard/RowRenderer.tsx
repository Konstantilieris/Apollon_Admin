"use client";
import { STAGE_ENUM, useClientCard } from "@/hooks/use-client-card";
import React, { Suspense } from "react";

import { ClientProfileRow } from "./ClientProfileRow";
import ClientStatsRow from "./ClientStatsRow";
import { AnimatePresence, motion } from "framer-motion";
import BarLoader from "@/components/ui/shuffleLoader";
import ClientFeesRow from "./ClientFeesRow";
import ClientOverView from "./ClientOverView";

const RowRenderer = ({ client }: { client: any }) => {
  const { stage } = useClientCard();
  const renderRow = () => {
    switch (stage) {
      case STAGE_ENUM.INITIAL:
        return <ClientProfileRow client={client} />;
      case STAGE_ENUM.STATS:
        return <ClientStatsRow client={client} />;
      case STAGE_ENUM.FEES:
        return <ClientFeesRow client={client} />;
      case STAGE_ENUM.OVERVIEW:
        return <ClientOverView client={client} />;
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
