"use client";
import { cn, intToDate2, removeKeysFromQuery } from "@/lib/utils";
import React, { Suspense, useEffect, useState } from "react";

import { useRouter, useSearchParams } from "next/navigation";
import DogButton from "./DogButton";
import LineSkeleton from "../shared/LineSkeleton";
import { ExpandableCard } from "../shared/cards/OccupiedBed";
import PendingBed from "../shared/cards/PendingBed";
import dynamic from "next/dynamic";
const DynamicModal = dynamic(() => import("./CreateBookingModal"), {
  ssr: false,
});

interface BedProps {
  isDog: any;
  name: string;
  clientDogs: any;
  roomName: string;
  roomId: string;
  clientName: string;
  clientId: string;
  dailyPrice: number;
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
  clientName,
  clientId,
  dailyPrice,
}: BedProps) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [bed, setBed] = useState<BedType>({
    name,
    occupied: false,
    pending: null,
    data: null,
  });
  useEffect(() => {
    const newUrl = removeKeysFromQuery({
      params: searchParams.toString(),
      keysToRemove: [clientDogs.map((dog: any) => dog._id)],
    });
    router.push(newUrl, { scroll: false });
    setBed((prevBed) => ({
      ...prevBed,
      pending: null,
      occupied: isDog,
    }));
  }, [searchParams.get("fr"), searchParams.get("to")]);
  const handleDeleteDogFromBed = () => {
    if (!bed.pending) return;
    const newUrl = removeKeysFromQuery({
      params: searchParams.toString(),
      keysToRemove: [bed.pending.dogId],
    });
    router.push(newUrl, { scroll: false });
    setBed({
      ...bed,
      pending: null,
    });
  };

  return (
    <Suspense fallback={<LineSkeleton />}>
      {open && bed.pending && (
        <DynamicModal
          setOpen={setOpen}
          isOpen={open}
          dogs={clientDogs}
          clientId={clientId}
          clientDaily={dailyPrice}
        />
      )}
      <div
        className={cn(
          "flex h-32 w-full max-w-[230px] relative flex-col items-center justify-center text-start font-sans text-white bg-slate-500",
          { "bg-red-800": bed.occupied },
          { "bg-indigo-400 dark:bg-indigo-700": bed?.pending }
        )}
      >
        {bed.occupied ? (
          <ExpandableCard data={JSON.parse(JSON.stringify(bed.occupied))} />
        ) : bed.pending ? (
          <PendingBed
            pending={bed.pending}
            onDelete={handleDeleteDogFromBed}
            clientName={clientName}
            fromDate={intToDate2(+searchParams.get("fr")!)}
            toDate={intToDate2(+searchParams.get("to")!)}
            setOpen={setOpen}
            clientId={clientId}
          />
        ) : (
          <div>
            {clientDogs.map((dog: any) =>
              searchParams.has(dog._id) ? (
                <></>
              ) : (
                <DogButton
                  key={dog._id}
                  dog={dog}
                  bedName={name}
                  roomName={roomName}
                  setBed={setBed}
                  bed={bed}
                  roomId={roomId}
                />
              )
            )}
          </div>
        )}
      </div>
    </Suspense>
  );
};

export default Bed;
