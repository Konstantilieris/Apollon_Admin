"use client";
import { useToast } from "@/components/ui/use-toast";
import { IBooking } from "@/database/models/booking.model";
import {
  getBookingById,
  updateBookingAllInclusive,
} from "@/lib/actions/booking.action";
import { cn, formatDate } from "@/lib/utils";
import React, { useEffect, useState } from "react";
import {
  IconCalendar,
  IconCar,
  IconArrowLeft,
  IconCheck,
  IconArrowRight,
  IconHome,
} from "@tabler/icons-react";

interface props {
  setStage: any;
  rangeDate: any;
  isTransport1: any;
  isTransport2: any;
  bookingId: any;
  data: any;
  onClose: any;
  roomPreference: string;
  stage: number;
}
const FourthStage = ({
  setStage,
  rangeDate,
  isTransport1,
  isTransport2,
  bookingId,
  data,
  onClose,
  roomPreference,
  stage,
}: props) => {
  const [booking, setBooking] = useState<IBooking>();
  const { toast } = useToast();
  useEffect(() => {
    const fetchData = async () => {
      const res = await getBookingById(JSON.parse(JSON.stringify(bookingId)));

      setBooking(JSON.parse(res));
    };
    fetchData();
  }, [stage]);

  const handleComplete = async () => {
    if (!booking) return;

    try {
      const res = await updateBookingAllInclusive({
        dogsData: data,
        booking,
        rangeDate,
        isTransport1,
        isTransport2,
        roomPreference,
      });
      const newBooking = JSON.parse(res);
      if (newBooking) {
        toast({
          className: cn(
            "bg-celtic-green border-none text-white   text-center flex flex-center max-w-[300px] bottom-0 left-0 fixed  "
          ),
          title: "Επιτυχία",
          description: `η κράτηση ενημερώθηκε με επιτυχία`,
        });
        setStage(0);
        onClose();
      }
    } catch (error) {
      toast({
        className: cn(
          "bg-celtic-red border-none text-white   text-center flex flex-center max-w-[300px] bottom-0 left-0 fixed  "
        ),
        title: "Σφάλμα",
        description: `Υπήρξε ένα σφάλμα κατά την ενημέρωση της κράτησης`,
      });
    }
  };

  return (
    <div className="flex h-[60vh] w-full flex-col gap-4 px-4 py-8">
      <h1 className="flex flex-row gap-2 text-3xl">
        Πραγματοποιειται ενημέρωση στην κράτηση{" "}
        <span className="text-yellow-500">{bookingId}</span>
      </h1>

      {/* Date Info Section */}
      <div className="mt-20 px-8">
        <div className="flex flex-col gap-4 text-xl">
          <div className="flex items-center gap-2">
            <IconCalendar className="text-yellow-500" size={24} />
            <span>Ημερομηνία Άφιξης:</span>
            <span>{formatDate(rangeDate.from, "el-GR")}</span>
          </div>
          <div className="flex items-center gap-2">
            <IconCalendar className="text-yellow-500" size={24} />
            <span>Ημερομηνία Αναχώρησης:</span>
            <span>{formatDate(rangeDate.to, "el-GR")}</span>
          </div>
        </div>

        {/* Transport Info Section */}
        <div className="mt-4 flex flex-col gap-4 text-xl">
          <div className="flex items-center gap-2">
            <IconCar className="text-yellow-500" size={24} />
            <span>Μεταφορά Αφιξης:</span>
            <span>{isTransport1 ? "Ναι" : "Όχι"}</span>
          </div>
          <div className="flex items-center gap-2">
            <IconCar className="text-yellow-500" size={24} />
            <span>Μεταφορά Αναχώρησης:</span>
            <span>{isTransport2 ? "Ναι" : "Όχι"}</span>
          </div>
        </div>
        <div className="mt-2   flex min-w-[16vw] flex-col px-2 text-start">
          {data.map((dog: any, index: number) => (
            <div key={index} className=" mt-2  flex flex-row gap-3 text-xl">
              <IconHome className="text-yellow-500" />{" "}
              <span className="min-w-[5vw]">{dog.dogName}</span>
              <IconArrowRight />
              <span className="ml-4">{dog.roomName}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Buttons Section */}
      <div className="mb-4 ml-2 flex h-full flex-row items-end justify-end gap-4 self-end">
        <button
          onClick={() => setStage(1)}
          className="group relative  z-50 border border-black bg-transparent px-8  py-2 text-black transition duration-200 dark:border-white"
        >
          <div className="absolute -bottom-2 -right-2 -z-10 h-full w-full bg-pink-600 transition-all duration-200 group-hover:bottom-0 group-hover:right-0" />
          <span className="relative flex flex-row items-center text-xl">
            <IconArrowLeft size={20} />
            Επιστροφή
          </span>
        </button>

        <button
          onClick={handleComplete}
          className="group relative  z-50 border border-black bg-transparent px-8  py-2 text-black transition duration-200 dark:border-white"
        >
          <div className="absolute -bottom-2 -right-2 -z-10 h-full w-full bg-green-500 transition-all duration-200 group-hover:bottom-0 group-hover:right-0" />
          <span className="relative flex flex-row items-center text-xl">
            {" "}
            ΟΛΟΚΛΗΡΩΣΗ
            <IconCheck size={20} className="ml-2 group-hover:animate-ping" />
          </span>
        </button>
      </div>
    </div>
  );
};

export default FourthStage;
