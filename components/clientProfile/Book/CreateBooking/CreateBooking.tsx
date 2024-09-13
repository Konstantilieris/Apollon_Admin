"use client";
import React, { useEffect, useState } from "react";

import { useSearchParams, usePathname } from "next/navigation";

import { calculateTotalPrice, cn, intToDate2, setLocalTime } from "@/lib/utils";
import { createBooking } from "@/lib/actions/booking.action";
import { Loader } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { IconArrowRight } from "@tabler/icons-react";

interface BookingProps {
  dogs: any;
  client: {
    clientId: string;
    clientName: string;
    bookingFee: number;
    transportFee: number;
    phone: string;
    location: string;
  };
  roomPreference: string;
  setStage: (stage: number) => void;
}
const CreateBooking = ({
  roomPreference,
  dogs,
  client,
  setStage,
}: BookingProps) => {
  const searchParams = useSearchParams();
  const fromDate = setLocalTime(
    intToDate2(+searchParams.get("fr")!),
    searchParams.get("tm1")!
  );
  const toDate = setLocalTime(
    intToDate2(+searchParams.get("to")!),
    searchParams.get("tm2")!
  );
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const transportFeeArrival = searchParams.has("flag1")
    ? client.transportFee
    : 0;
  const transportFeeDeparture = searchParams.has("flag2")
    ? client.transportFee
    : 0;
  const [amount, setAmount] = useState(
    calculateTotalPrice({ fromDate, toDate, dailyPrice: client.bookingFee })
  );
  const [totalAmount, setTotalAmount] = React.useState(
    amount + transportFeeArrival + transportFeeDeparture
  );
  const { toast } = useToast();

  useEffect(() => {
    setTotalAmount(() => amount + transportFeeArrival + transportFeeDeparture);
  }, [amount]);
  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) return null;

  const handleCreateBooking = async () => {
    setLoading(true);
    try {
      const res = await createBooking({
        client,
        fromDate,
        toDate,
        totalprice: totalAmount,
        bookingData: dogs,
        flag1: searchParams.has("flag1"),
        flag2: searchParams.has("flag2"),
        path: pathname,
        roomPreference: roomPreference,
      });

      if (res) {
        toast({
          className: cn(
            "bg-celtic-green border-none text-white  font-sans text-center flex flex-center max-w-[300px] bottom-0 left-0 fixed  "
          ),
          title: "Επιτυχία",
          description: "Η κράτηση δημιουργήθηκε",
        });
      }
    } catch (error) {
      toast({
        className: cn(
          "bg-red-dark border-none text-white  font-sans text-center flex flex-center max-w-[300px] bottom-0 left-0 fixed  "
        ),
        title: "Failed to create Booking",
        description: `${error}`,
      });
    } finally {
      window.location.replace(pathname);
    }
  };

  return (
    <div className="min-h-[70vh] max-w-[75vw] flex flex-col justify-between pl-6 pr-12 px-6 w-full text-xl">
      <h1 className="self-center text-2xl font-semibold text-yellow-40000 mt-20 font-sans">
        Δημιουργία Κράτησης
      </h1>
      <div className="flex min-w-[180px] flex-col gap-2 rounded-lg bg-gray-100 p-3 text-xl dark:bg-neutral-900 font-sans ">
        {dogs.map((dog: any) => (
          <div
            key={dog.dogId}
            className="flex w-full flex-row  items-center justify-between  text-gray-800 dark:text-light-700"
          >
            <span className="min-w-[7vw]"> {dog.dogName}</span>

            <IconArrowRight size={18} className="min-w-[5vw] text-yellow-500" />
            <span className="min-w-[5vw]">{dog.roomName}</span>
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex flex-row justify-between">
          <h2 className="font-semibold">Από:</h2>
          <h2 className="font-semibold">
            {fromDate.toLocaleDateString()} {fromDate.toLocaleTimeString()}
          </h2>
        </div>
        <div className="flex flex-row justify-between">
          <h2 className="font-semibold">Μέχρι:</h2>
          <h2 className="font-semibold">
            {toDate.toLocaleDateString()} {toDate.toLocaleTimeString()}
          </h2>
        </div>
        {searchParams.has("flag1") && (
          <div className="flex flex-row justify-between">
            <h2 className="font-semibold">Κόστος Παραλαβής:</h2>
            <h2 className="font-semibold">{client.transportFee || 0}€</h2>
          </div>
        )}
        {searchParams.has("flag2") && (
          <div className="flex flex-row justify-between">
            <h2 className="font-semibold">Κόστος Παράδοσης:</h2>
            <h2 className="font-semibold">{client.transportFee || 0}€</h2>
          </div>
        )}

        <div className="flex flex-row justify-between">
          <h2 className="font-semibold">Κόστος Διαμονής:</h2>
          <input
            type="number"
            className="border-2 border-dark-100 bg-dark-200 text-light-700"
            value={amount}
            onChange={(e) => setAmount(+e.target.value)}
          />
        </div>
        <div className="flex flex-row justify-between">
          <h2 className="font-semibold">Συνολικό Κόστος:</h2>
          <h2 className="font-semibold">{totalAmount}€</h2>
        </div>
      </div>
      <div>
        <div className="gap-2 flex flex-row w-full justify-end ">
          <Button
            className="border-2 border-red-800 bg-dark-200  text-light-700 transition-colors hover:scale-105 text-lg  hover:bg-red-800"
            onClick={() => setStage(0)}
            variant={null}
          >
            Ακυρωση
          </Button>
          <Button
            onClick={() => handleCreateBooking()}
            className="border border-dark-100 bg-yellow-600  transition-colors hover:scale-105 hover:bg-yellow-700 text-lg "
            variant={null}
          >
            {loading ? (
              <Loader size={24} className="animate-spin" />
            ) : (
              "Δημιουργία"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreateBooking;
