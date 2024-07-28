"use client";
import React, { useEffect, useState } from "react";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
} from "../ui/animated-modal";

import { Button } from "../ui/button";
import { useSearchParams, usePathname } from "next/navigation";
import { useToast } from "../ui/use-toast";
import { calculateTotalPrice, cn, intToDate2, setLocalTime } from "@/lib/utils";
import { createBooking } from "@/lib/actions/booking.action";
import { Loader } from "lucide-react";

interface BookingProps {
  isOpen: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  dogs: any;
  client: {
    clientId: string;
    clientName: string;
    bookingFee: number;
    transportFee: number;
    phone: string;
    location: string;
  };
}
const CreateBookingModal = ({
  isOpen,
  setOpen,
  dogs,
  client,
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

  const bookingData = dogs
    .map((dog: any) => {
      if (searchParams.has(dog._id)) {
        return {
          dogId: dog._id,
          dogName: dog.name,
          roomId: searchParams.get(dog._id)?.split("_")[1],
          roomName: searchParams.get(dog._id)?.split("_")[0],
        };
      } else {
        return null;
      }
    })
    .filter((dog: any) => dog !== null);

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
        bookingData,
        flag1: searchParams.has("flag1"),
        flag2: searchParams.has("flag2"),
        path: pathname,
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
    <Modal>
      <ModalBody
        isOpen={isOpen}
        setOpen={setOpen}
        className="bg-dark-100  text-white"
      >
        <ModalContent className="flex flex-col justify-around font-sans">
          <h1 className="self-center text-2xl font-semibold text-purple-400">
            Δημιουργία Κράτησης
          </h1>
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
        </ModalContent>
        <ModalFooter className="gap-2 bg-purple-400">
          <Button
            className="border-2 border-red-800 bg-dark-200 font-sans text-light-700 transition-colors hover:scale-105   hover:bg-red-800"
            onClick={() => setOpen(false)}
            variant={null}
          >
            Ακυρωση
          </Button>
          <Button
            onClick={() => handleCreateBooking()}
            className="border border-dark-100 bg-purple-800 font-sans transition-colors hover:scale-105 hover:bg-purple-900 "
            variant={null}
          >
            {loading ? (
              <Loader size={24} className="animate-spin" />
            ) : (
              "Δημιουργία"
            )}
          </Button>
        </ModalFooter>
      </ModalBody>
    </Modal>
  );
};

export default CreateBookingModal;
