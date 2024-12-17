"use client";

import React from "react";
import Image from "next/image";

const ClientLoyalty = ({ loyaltyLevel }: { loyaltyLevel: string }) => {
  const loyaltyIcon = () => {
    switch (loyaltyLevel) {
      case "bronze":
        return (
          <Image
            src="/assets/icons/bronze-medal.svg"
            width={34}
            height={34}
            alt="bronze"
          />
        );
      case "silver":
        return (
          <Image
            src="/assets/icons/silver-medal.svg"
            width={34}
            height={34}
            alt="silver"
          />
        );
      case "gold":
        return (
          <Image
            src="/assets/icons/gold-medal.svg"
            width={34}
            height={34}
            alt="gold"
          />
        );
      case "platinum":
        return <span className="text-xs text-gray-400">Platinum</span>;
    }
  };

  return (
    <div className="group relative flex h-[100px]  w-[300px] select-none items-center  space-x-4 rounded-lg bg-neutral-800 px-4 py-2">
      {loyaltyIcon()}
      <div className="flex w-full flex-col items-start ">
        <span className="text-lg font-bold uppercase tracking-wide">
          {loyaltyLevel}
        </span>
        <span className="text-sm leading-5 tracking-wide text-gray-400">
          Επίπεδο Πιστότητας
        </span>
      </div>
    </div>
  );
};

export default ClientLoyalty;
