"use client";
import React from "react";
import { motion } from "framer-motion";

const LineSkeleton: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-8">
      <motion.div
        style={{
          width: "100%",
          height: "2px",
          background: "linear-gradient(to right, #D5A6F1, #6D28D9)",
          position: "relative",
        }}
        initial={{ scaleX: 0.4 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1 }}
      />
      <motion.div
        style={{
          width: "100%",
          height: "2px",
          background: "linear-gradient(to right, #D5A6F1, #6D28D9)",
          position: "relative",
        }}
        initial={{ scaleX: 0.4 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1 }}
      />
      <motion.div
        style={{
          width: "100%",
          height: "2px",
          background: "linear-gradient(to right, #D5A6F1, #6D28D9)",
          position: "relative",
        }}
        initial={{ scaleX: 0.4 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1 }}
      />
    </div>
  );
};

export default LineSkeleton;
