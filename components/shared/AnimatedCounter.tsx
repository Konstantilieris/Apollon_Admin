"use client";
import React from "react";
import CountUp from "react-countup";

const AnimatedCounter = ({ amount }: { amount: number }) => {
  return (
    <div>
      <CountUp
        end={amount}
        duration={3}
        prefix="€"
        separator=""
        decimals={2}
        decimal=","
      />
    </div>
  );
};

export default AnimatedCounter;
