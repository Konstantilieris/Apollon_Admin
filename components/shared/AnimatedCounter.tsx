"use client";
import React from "react";
import CountUp from "react-countup";
interface CounterProps {
  amount: number;
  noPrefix?: boolean;
}
const AnimatedCounter = ({ amount, noPrefix = false }: CounterProps) => {
  return (
    <div>
      <CountUp
        end={amount}
        duration={3}
        prefix={noPrefix ? "" : "€"}
        separator=""
        decimals={noPrefix ? 0 : 2}
        decimal=","
      />
    </div>
  );
};

export default AnimatedCounter;
