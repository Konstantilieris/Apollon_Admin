"use client";
import React, { useEffect, useState } from "react";

import { usePathname } from "next/navigation";

import { calculateTotalPrice, cn } from "@/lib/utils";
import { createBooking } from "@/lib/actions/booking.action";
import { Loader } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { IconArrowRight, IconLetterKSmall } from "@tabler/icons-react";

import { DateRange } from "react-day-picker";

interface BookingProps {
  dogs: any;
  client: {
    clientId: string;
    clientName: string;
    phone: string;
    location: string;
    bookingFee: number;
    transportFee: number;
  };
  taxiArrival: Boolean;
  taxiDeparture: Boolean;
  rangeDate: DateRange;
  roomPreference: string;
  setStage: (stage: number) => void;
}
const CreateBooking = ({
  roomPreference,
  dogs,
  client,
  rangeDate,
  taxiArrival,
  taxiDeparture,
  setStage,
}: BookingProps) => {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  const [amount, setAmount] = useState(
    calculateTotalPrice({
      fromDate: rangeDate.from ? rangeDate.from : new Date(),
      toDate: rangeDate.to ? rangeDate.to : new Date(),
      dailyPrice: client.bookingFee,
    })
  );
  const transportFeeArrival = taxiArrival ? client.transportFee : 0;
  const transportFeeDeparture = taxiDeparture ? client.transportFee : 0;
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
        rangeDate,
        boardingPrice: amount,
        transportationPrice: client.transportFee,
        dogsData: dogs,
        flag1: taxiArrival,
        flag2: taxiDeparture,
        path: pathname,
        roomPrefer: roomPreference,
      });

      if (res) {
        toast({
          className: cn(
            "bg-celtic-green border-none text-white   text-center flex flex-center max-w-[300px] bottom-0 left-0 fixed  "
          ),
          title: "Επιτυχία",
          description: "Η κράτηση δημιουργήθηκε",
        });
        window.location.replace("/calendar");
      }
    } catch (error) {
      toast({
        className: cn(
          "bg-red-dark border-none text-white   text-center flex flex-center max-w-[300px] bottom-0 left-0 fixed  "
        ),
        title: "Failed to create Booking",
        description: `${error}`,
      });
    }
  };
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader size={40} className="animate-spin text-yellow-500" />
        <p className="ml-4 text-lg">Δημιουργία κράτησης...</p>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-[70vh] w-full max-w-[75vw] flex-col justify-between px-6 pr-12 text-xl">
      <h1 className=" mt-4 self-start  text-2xl  text-yellow-400">
        Δημιουργία Κράτησης
      </h1>
      <IconLetterKSmall
        size={50}
        className="absolute right-2 top-2 text-yellow-500"
      />
      <h2 className="mt-8   uppercase">ΠΕΛΑΤΗΣ : {client.clientName}</h2>
      <div className="flex min-w-[180px] flex-col gap-2 rounded-lg bg-gray-100 p-3  text-xl dark:bg-neutral-900 ">
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
      <div className="flex w-full flex-col gap-2">
        <div className="flex  flex-row gap-8">
          <h2 className="min-w-[12vw] ">
            ΗΜ. {taxiArrival ? "ΠΑΡΑΛΑΒΗΣ" : "ΑΦΙΞΗΣ"}
          </h2>
          <h2 className="">{rangeDate?.from?.toLocaleDateString()} </h2>
        </div>

        <div className="flex flex-row gap-8">
          <h2 className="min-w-[12vw] ">
            ΗΜ.{taxiArrival ? "ΠΑΡΑΔΟΣΗΣ" : "ΑΝΑΧΩΡΗΣΗΣ"} :
          </h2>
          <h2 className="">{rangeDate?.to?.toLocaleDateString()} </h2>
        </div>
        <div className="flex flex-row gap-8">
          <h2 className="min-w-[12vw] ">
            ΩΡΑ {taxiArrival ? "ΠΑΡΑΛΑΒΗΣ" : "ΑΦΙΞΗΣ"}:
          </h2>
          <h2 className="">
            {rangeDate?.from?.toLocaleTimeString("el-GR", {
              hour: "numeric",
              minute: "numeric",
              hour12: true,
            })}
          </h2>
        </div>
        <div className="flex flex-row gap-8">
          <h2 className="min-w-[12vw] ">
            ΩΡΑ {taxiArrival ? "ΠΑΡΑΔΟΣΗΣ" : "ΑΝΑΧΩΡΗΣΗΣ"}:
          </h2>
          <h2 className="">
            {rangeDate?.to?.toLocaleTimeString("el-GR", {
              hour: "numeric",
              minute: "numeric",
              hour12: true,
            })}
          </h2>
        </div>
        {taxiArrival && (
          <div className="flex flex-row gap-8">
            <h2 className="min-w-[12vw] ">ΚΟΣΤΟΣ ΠΑΡΑΛΑΒΗΣ:</h2>
            <h2 className="">{client.transportFee || 0}€</h2>
          </div>
        )}
        {taxiDeparture && (
          <div className="flex flex-row gap-8">
            <h2 className="min-w-[12vw] ">ΚΟΣΤΟΣ ΠΑΡΑΔΟΣΗΣ:</h2>
            <h2 className="">{client.transportFee || 0}€</h2>
          </div>
        )}

        <div className="flex flex-row gap-8">
          <h2 className="min-w-[12vw] ">ΚΟΣΤΟΣ ΔΙΑΜΟΝΗΣ:</h2>
          <input
            type="number"
            className="border-2 border-dark-100 bg-dark-200 text-light-700"
            value={amount}
            onChange={(e) => setAmount(+e.target.value)}
          />
        </div>
        <div className="flex flex-row gap-8">
          <h2 className="min-w-[12vw] ">ΣΥΝΟΛΙΚΟ ΚΟΣΤΟΣ:</h2>
          <h2 className="">{totalAmount}€</h2>
        </div>
      </div>
      <div>
        <div className="flex w-full flex-row justify-center gap-2 ">
          <Button
            className="border-2 border-red-800 bg-dark-200  text-lg text-light-700 transition-colors hover:scale-105  hover:bg-red-800"
            onClick={() => setStage(0)}
            variant={null}
          >
            Ακυρωση
          </Button>

          <Button
            onClick={() => handleCreateBooking()}
            className="border border-dark-100 bg-yellow-600  text-lg transition-colors hover:scale-105 hover:bg-yellow-700 "
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
