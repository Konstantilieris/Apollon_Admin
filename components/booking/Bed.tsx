"use client";
import { cn, removeKeysFromQuery } from "@/lib/utils";
import React, { Suspense, useEffect, useState } from "react";

import { useRouter, useSearchParams } from "next/navigation";

import CardSkeleton from "../shared/skeletons/CardSkeleton";

interface BedProps {
  isDog: any;
  name: string;
  clientDogs: any;
  roomName: string;
  roomId: string;
  client: {
    clientId: string;
    clientName: string;
    bookingFee: number;
    transportFee: number;
    phone: string;
    location: string;
  };
}
export type BedType = {
  name: string;
  occupied: boolean;
  pending: {
    dogName: string;
    bedName: string;
    roomName: string;
    dogId: string;
  } | null;
  data: any;
};
const Bed = ({
  isDog,
  name,
  clientDogs,
  roomName,
  roomId,
  client,
}: BedProps) => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [bed, setBed] = useState<BedType>({
    name,
    occupied: false,
    pending: null,
    data: null,
  });
  useEffect(() => {
    const newUrl = removeKeysFromQuery({
      params: searchParams.toString(),
      keysToRemove: [...clientDogs.map((dog: any) => dog._id)],
    });
    router.push(newUrl, { scroll: false });
    setBed((prevBed) => ({
      ...prevBed,
      pending: null,
      occupied: isDog,
    }));
  }, [searchParams.get("fr"), searchParams.get("to")]);

  return (
    <Suspense fallback={<CardSkeleton />}>
      <div
        className={cn(
          "flex h-32 w-full max-w-[230px] relative flex-col items-center justify-center text-start font-sans text-white bg-slate-500",
          { "bg-red-800": bed.occupied },
          { "bg-indigo-400 dark:bg-indigo-700": bed?.pending }
        )}
      >
        hey
      </div>
    </Suspense>
  );
};

export default Bed;
