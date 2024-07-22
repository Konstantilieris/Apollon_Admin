"use client";
import React, { useEffect, useState } from "react";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
} from "../ui/animated-modal";

import { Button } from "../ui/button";
import { useSearchParams, useRouter } from "next/navigation";
import { useToast } from "../ui/use-toast";
import {
  calculateTotalPrice,
  cn,
  intToDate2,
  removeKeysFromQuery,
  setLocalTime,
} from "@/lib/utils";
import { createBooking } from "@/lib/actions/booking.action";
import { Loader } from "lucide-react";

interface BookingProps {
  isOpen: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  clientId: string;
  dogs: any;
  clientDaily: number;
}
const CreateBookingModal = ({
  isOpen,
  setOpen,
  clientId,
  dogs,
  clientDaily,
}: BookingProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const fromDate = setLocalTime(
    intToDate2(+searchParams.get("fr")!),
    searchParams.get("tm1")!
  );
  const toDate = setLocalTime(
    intToDate2(+searchParams.get("to")!),
    searchParams.get("tm2")!
  );
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [costDeparture, setCostDeparture] = React.useState(0);
  const [costArrival, setCostArrival] = React.useState(0);
  const [amount, setAmount] = useState(
    calculateTotalPrice({ fromDate, toDate, dailyPrice: clientDaily })
  );
  const [totalAmount, setTotalAmount] = React.useState(
    amount + costDeparture + costArrival
  );
  const { toast } = useToast();

  const cleanDogs = dogs
    .map((dog: any) => {
      if (searchParams.has(dog._id)) {
        return {
          dogId: dog._id,
          dogName: dog.name,
          roomId: searchParams.get(dog._id)?.split("_")[1],
        };
      } else {
        return null;
      }
    })
    .filter((dog: any) => dog !== null);
  console.log(cleanDogs);
  useEffect(() => {
    setTotalAmount(amount + costDeparture + costArrival);
  }, [costDeparture, costArrival, amount]);
  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) return null;
  const handleCreateBooking = async () => {
    setLoading(true);
    try {
      const res = await createBooking({
        clientId_string: clientId,
        fromDate,
        toDate,
        totalprice: totalAmount,
        bookingData: cleanDogs,
        flag1: searchParams.has("flag1"),
        flag2: searchParams.has("flag2"),
        path: "/createbooking",
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
      const newUrl = removeKeysFromQuery({
        params: searchParams.toString(),
        keysToRemove: [
          ...dogs.map((dog: any) => dog._id),
          "fr",
          "to",
          "tm1",
          "tm2",
          "flag1",
          "flag2",
        ],
      });
      router.push(newUrl, { scroll: false });
      window.location.reload();
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
                <h2 className="font-semibold">Κόστος Αναχώρησης:</h2>
                <input
                  type="number"
                  className="border-2 border-dark-100 bg-dark-200 text-light-700"
                  value={costDeparture}
                  onChange={(e) => setCostDeparture(+e.target.value)}
                />
              </div>
            )}
            {searchParams.has("flag2") && (
              <div className="flex flex-row justify-between">
                <h2 className="font-semibold">Κόστος Άφιξης:</h2>
                <input
                  type="number"
                  className="border-2 border-dark-100 bg-dark-200 text-light-700"
                  value={costArrival}
                  onChange={(e) => setCostArrival(+e.target.value)}
                />
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
