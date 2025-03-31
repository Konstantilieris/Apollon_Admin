"use client";
import React, { useEffect, useState } from "react";

import { usePathname } from "next/navigation";

import { calculateTotalPrice, cn } from "@/lib/utils";
import { createBooking } from "@/lib/actions/booking.action";
import { Loader } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { IconArrowRight } from "@tabler/icons-react";

import { useBookingStore } from "@/hooks/booking-store";

interface BookingProps {
  client: {
    clientId: string;
    clientName: string;
    phone: string;
    location: string;
    bookingFee: number;
    transportFee: number;
  };

  setStage: (stage: number) => void;
}
const CreateBooking = ({
  client,

  setStage,
}: BookingProps) => {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const {
    dateArrival,
    dateDeparture,
    taxiArrival,
    taxiDeparture,
    data,
    roomPreference,
    extraDay,
    resetStore,
  } = useBookingStore();

  const [amount, setAmount] = useState(
    calculateTotalPrice({
      fromDate: dateArrival || new Date(),
      toDate: dateDeparture || new Date(),
      dailyPrice: client.bookingFee,
    })
  );

  const extraDayPrice = extraDay ? client.bookingFee : 0;
  const transportFeeArrival = taxiArrival ? client.transportFee : 0;
  const transportFeeDeparture = taxiDeparture ? client.transportFee : 0;
  const [totalAmount, setTotalAmount] = React.useState(
    amount + transportFeeArrival + transportFeeDeparture + extraDayPrice
  );
  const { toast } = useToast();

  useEffect(() => {
    setTotalAmount(
      () => amount + transportFeeArrival + transportFeeDeparture + extraDayPrice
    );
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
        dateArrival,
        dateDeparture,
        extraDay,
        extraDayPrice,
        boardingPrice: amount,
        transportationPrice: client.transportFee,
        dogsData: data,
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
      }
    } catch (error) {
      toast({
        className: cn(
          "bg-red-dark border-none text-white   text-center flex flex-center max-w-[300px] bottom-0 left-0 fixed  "
        ),
        title: "Failed to create Booking",
        description: `${error}`,
      });
    } finally {
      setLoading(false);
      resetStore();
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
    <section className="absolute inset-0 px-8 py-4">
      <div className="relative flex  h-full w-full flex-col items-center gap-8 space-y-4">
        <h1 className=" mt-4 self-start  text-2xl  text-yellow-400">
          Δημιουργία Κράτησης
        </h1>

        <h2 className="mt-8   min-w-[26vw] text-start text-2xl uppercase">
          ΠΕΛΑΤΗΣ : {client.clientName}
        </h2>
        <div className="flex  min-w-[26vw]  flex-col gap-2  self-center rounded-lg bg-gray-100 p-3 text-center text-xl dark:bg-neutral-900">
          {data.map((dog: any) => (
            <div
              key={dog.dogId}
              className="flex  flex-row  items-center justify-between  py-2 text-gray-800 dark:text-light-700"
            >
              <span className="min-w-[7vw]"> {dog.dogName}</span>

              <IconArrowRight
                size={18}
                className="min-w-[5vw] text-yellow-500"
              />
              <span className="ml-8 min-w-[7vw]">{dog.roomName}</span>
            </div>
          ))}
        </div>
        <div className="flex h-full w-full flex-col items-center gap-2 space-y-2 text-xl">
          <div className="flex min-w-[25vw]  gap-8 text-start">
            <h2 className="min-w-[11vw] ">
              ΗΜ. {taxiArrival ? "ΠΑΡΑΛΑΒΗΣ" : "ΑΦΙΞΗΣ"} :
            </h2>
            <h2 className="ml-2">
              {dateArrival?.toLocaleDateString()} -{" "}
              {dateArrival?.toLocaleTimeString("el-GR", {
                hour: "numeric",
                minute: "numeric",
                hour12: true,
              })}{" "}
            </h2>
          </div>

          <div className="flex min-w-[25vw]  gap-8 text-start ">
            <h2 className=" min-w-[11vw]">
              ΗΜ.{taxiDeparture ? "ΠΑΡΑΔΟΣΗΣ" : "ΑΝΑΧΩΡΗΣΗΣ"} :
            </h2>
            <h2 className="ml-2">
              {dateDeparture?.toLocaleDateString()} -{" "}
              {dateDeparture?.toLocaleTimeString("el-GR", {
                hour: "numeric",
                minute: "numeric",
                hour12: true,
              })}{" "}
            </h2>
          </div>
          <div className="flex min-w-[25vw]  gap-8 text-start ">
            <h2 className=" min-w-[11vw]">ΣΥΝΟΛΟ ΗΜΕΡΩΝ :</h2>
            <h2 className="ml-2">
              {dateDeparture && dateArrival
                ? Math.round(
                    (dateDeparture.getTime() - dateArrival.getTime()) /
                      (1000 * 60 * 60 * 24)
                  )
                : "N/A"}{" "}
            </h2>
            {extraDay && <h2 className="items-center text-green-500">+ 1</h2>}
          </div>

          {taxiArrival && (
            <div className="flex  min-w-[25vw] gap-8">
              <h2 className="min-w-[11vw]">ΚΟΣΤΟΣ ΠΑΡΑΛΑΒΗΣ:</h2>
              <h2 className="">{client.transportFee || 0}€</h2>
            </div>
          )}
          {taxiDeparture && (
            <div className="flex min-w-[25vw] gap-8">
              <h2 className="min-w-[11vw] ">ΚΟΣΤΟΣ ΠΑΡΑΔΟΣΗΣ:</h2>
              <h2 className="">{client.transportFee || 0}€</h2>
            </div>
          )}
          <div className="flex min-w-[25vw] gap-8">
            <h2 className="min-w-[11vw]">ΗΜΕΡΗΣΙΟ ΚΟΣΤΟΣ: </h2>
            <span className="ml-2">{client.bookingFee ?? 0} €</span>
          </div>
          <div className="flex  min-w-[25vw] gap-8">
            <h2 className="min-w-[11vw]">ΚΟΣΤΟΣ ΔΙΑΜΟΝΗΣ:</h2>
            <input
              type="number"
              className="ml-2 border-2 border-dark-100 bg-dark-200 text-light-700"
              value={amount}
              onChange={(e) => setAmount(+e.target.value)}
            />
          </div>

          <div className="flex  min-w-[25vw]   gap-8 text-start">
            <h2 className="min-w-[11vw] ">ΣΥΝΟΛΙΚΟ ΚΟΣΤΟΣ:</h2>
            <h2 className="ml-2">{totalAmount} €</h2>
          </div>
        </div>
        <div>
          <div className="flex w-full flex-row justify-center gap-2 ">
            <Button
              className="min-w-[180px] border-2 border-red-800  bg-dark-200 p-2 py-6  text-xl text-light-700 transition-colors hover:scale-105 hover:bg-red-800"
              onClick={() => setStage(0)}
              variant={null}
            >
              Ακυρωση
            </Button>

            <Button
              onClick={() => handleCreateBooking()}
              className="min-w-[180px] border border-dark-100  bg-yellow-600 py-6 text-xl transition-colors hover:scale-105 hover:bg-yellow-700 "
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
    </section>
  );
};

export default CreateBooking;
