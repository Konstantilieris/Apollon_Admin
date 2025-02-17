"use client";
import { STAGE_ENUM, useClientCard } from "@/hooks/use-client-card";
import React from "react";
import dynamic from "next/dynamic";
import { AnimatePresence, motion } from "framer-motion";
import BarLoader from "@/components/ui/shuffleLoader";

// Dynamically import components with loading fallback
const LazyClientProfileRow = dynamic(
  () => import("./Loyalty/ClientMedalWrapper"),
  {
    loading: () => <BarLoader />,
  }
);
const LazyClientStatsRow = dynamic(
  () => import("./StatsCards/ClientStatsRow"),
  {
    loading: () => <BarLoader />,
  }
);
const LazyClientFeesRow = dynamic(() => import("./FeeCards/ClientFeesRow"), {
  loading: () => <BarLoader />,
});
const LazyClientOverView = dynamic(
  () => import("./AnalyticsCards/ClientOverView"),
  {
    loading: () => <BarLoader />,
  }
);

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
      <motion.div
        className="flex h-full w-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5, ease: "easeIn" }}
      >
        {renderRow()}
      </motion.div>
    </AnimatePresence>
  );
};

export default RowRenderer;
