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
  IconArrowRight,
  IconHome,
} from "@tabler/icons-react";
import ButtonModal from "./buttonModal";
import useEditBookingStore from "@/hooks/editBooking-store";

interface props {
  setStage: any;

  bookingId: any;
  data: any;
  onClose: any;
  roomPreference: string;
  stage: number;
}
const FourthStage = ({
  setStage,

  bookingId,
  data,
  onClose,
  roomPreference,
  stage,
}: props) => {
  const [booking, setBooking] = useState<IBooking>();
  const { toast } = useToast();
  const { dateArrival, dateDeparture, taxiArrival, taxiDeparture, extraDay } =
    useEditBookingStore();

  useEffect(() => {
    const fetchData = async () => {
      const res = await getBookingById(JSON.parse(JSON.stringify(bookingId)));
      console.log("$extraDay", extraDay);
      setBooking(JSON.parse(res));
    };
    fetchData();
  }, [stage]);

  const handleComplete = async () => {
    if (!booking) return;

    try {
      const res = await updateBookingAllInclusive({
        extraDay,
        dogsData: data,
        booking,
        rangeDate: { from: dateArrival, to: dateDeparture },
        isTransport1: taxiArrival,
        isTransport2: taxiDeparture,
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
    <div className="flex h-[60vh] w-full flex-col gap-4 px-4 py-8 ">
      <h1 className="flex flex-row gap-2 text-3xl">
        Πραγματοποιειται ενημέρωση στην κράτηση{" "}
        <span className="text-yellow-500">{bookingId}</span>
      </h1>

      {/* Date Info Section */}
      <div className="mt-20 space-y-8 px-8 text-2xl">
        <div className="flex flex-col gap-4 ">
          <div className="flex items-center gap-2">
            <IconCalendar className="text-yellow-500" size={24} />
            <span>Ημερομηνία Άφιξης:</span>
            <span>{formatDate(dateArrival, "el-GR")}</span>
          </div>
          <div className="flex items-center gap-2">
            <IconCalendar className="text-yellow-500" size={24} />
            <span>Ημερομηνία Αναχώρησης:</span>
            <span>{formatDate(dateDeparture, "el-GR")}</span>
          </div>
          <div className="flex items-center gap-2">
            <IconCalendar className="text-yellow-500" size={24} />
            <span>Επιπλέον Ημέρα:</span>
            <span>{extraDay ? "Ναι" : "Όχι"}</span>
          </div>
        </div>

        {/* Transport Info Section */}
        <div className="mt-4 flex flex-col gap-4 ">
          <div className="flex items-center gap-2">
            <IconCar className="text-yellow-500" size={24} />
            <span>Μεταφορά Αφιξης:</span>
            <span>{taxiArrival ? "Ναι" : "Όχι"}</span>
          </div>
          <div className="flex items-center gap-2">
            <IconCar className="text-yellow-500" size={24} />
            <span>Μεταφορά Αναχώρησης:</span>
            <span>{taxiDeparture ? "Ναι" : "Όχι"}</span>
          </div>
        </div>

        {data.map((dog: any, index: number) => (
          <div
            key={index}
            className=" mt-2  flex w-full flex-row items-center  justify-start gap-2"
          >
            <IconHome className="text-yellow-500" />{" "}
            <span className="">{dog.dogName}</span>
            <IconArrowRight />
            <span className="">{dog.roomName}</span>
          </div>
        ))}
      </div>

      {/* Buttons Section */}
      <div className="mb-4 ml-2 flex h-full flex-row items-end justify-end gap-4 self-end">
        <ButtonModal
          title="ΕΠΙΣΤΡΟΦΗ"
          onClick={() => setStage(1)}
          gradientColor="via-yellow-500"
        />
        <ButtonModal
          title="ΑΠΟΘΗΚΕΥΣΗ"
          gradientColor="via-blue-500"
          containerStyle="text-blue-500"
          onClick={handleComplete}
        />
      </div>
    </div>
  );
};

export default FourthStage;
