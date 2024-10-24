"use client";
import {
  IconUser,
  IconCalendar,
  IconMapPin,
  IconPhone,
  IconCar,
  IconNote,
  IconHome,
  IconArrowRight,
  IconLoader,
} from "@tabler/icons-react";
import React, { useRef, useState } from "react";
import Link from "next/link";
import { deleteBooking } from "@/lib/actions/booking.action";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";

const FirstStage = ({ event, pairDate, setStage, onClose, reset }: any) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const ref = useRef(null);
  const handleDelete = async () => {
    setLoading(true);
    try {
      const booking = await deleteBooking({
        id: event.Id,
        clientId: event.clientId,
        path: "/calendar",
      });
      if (booking) {
        toast({
          className: cn(
            "bg-green-800 border-none text-white   text-center flex flex-center max-w-[300px] bottom-0 left-0 fixed  "
          ),
          title: "Επιτυχής Διαγραφή",
          description: `Η κράτηση διαγράφηκε με επιτυχία`,
        });
      }
    } catch (error) {
      toast({
        className: cn(
          "bg-red-800 border-none text-white   text-center flex flex-center max-w-[300px] bottom-0 left-0 fixed  "
        ),
        title: "Αποτυχία Διαγραφής",
        description: `Η κράτηση δεν διαγράφηκε`,
      });
    } finally {
      setLoading(false);
      onClose();
      reset();
    }
  };

  return (
    <div className="relative flex h-full w-full flex-col gap-4 p-4" ref={ref}>
      <h1 className="text-xl text-[#e9c85ef6]">Στοιχεία Κράτησης</h1>
      <p className="flex flex-row items-center gap-4 text-lg font-semibold">
        {event.isTransport && <IconCar />}
        {event.Subject}
      </p>
      {event.clientName && (
        <Link
          href={`/clients/${event.clientId}`}
          className="flex flex-row items-center gap-2 hover:scale-105 hover:text-blue-500"
        >
          <IconUser />
          {event?.clientName}
        </Link>
      )}
      {event.mobile && (
        <p className="flex flex-row items-center gap-2">
          <IconPhone />
          {event?.mobile}
        </p>
      )}
      {event.Location && (
        <p className="flex flex-row items-center gap-2">
          <IconMapPin />
          {event?.Location}
        </p>
      )}

      <p className="flex flex-row items-center gap-2">
        <IconCalendar />
        {event.isArrival
          ? event.StartTime.toLocaleString("el-GR")
          : new Date(pairDate).toLocaleString("el-GR")}
        -{"  "}
        {!event.isArrival
          ? event.StartTime.toLocaleString("el-GR")
          : new Date(pairDate).toLocaleString("el-GR")}
      </p>
      <p className="flex flex-row items-center gap-2">
        <IconNote />
        {event?.Description}
      </p>
      {event.dogsData?.map((dog: any) => (
        <p key={dog.dogId} className="flex flex-row items-center gap-2">
          <IconHome />
          {dog.dogName}
          <IconArrowRight />
          {dog.roomName}
        </p>
      ))}
      <div className="absolute bottom-0 right-4 flex w-full flex-row items-center justify-end gap-4">
        <button
          onClick={handleDelete}
          className="group relative  z-50 border border-black bg-transparent px-8  py-2 text-light-900 transition duration-200 dark:border-white"
        >
          <div className="absolute -bottom-2 -right-2 -z-10 h-full w-full bg-red-700 transition-all duration-200 group-hover:bottom-0 group-hover:right-0" />
          <span className="relative text-xl">
            {" "}
            {loading ? (
              <IconLoader className="animate-spin" size={20} />
            ) : (
              "ΔΙΑΓΡΑΦΗ"
            )}
          </span>
        </button>
        <button
          onClick={() => setStage(1)}
          className="group relative  z-50 border border-black bg-transparent px-8  py-2 text-black transition duration-200 dark:border-white"
        >
          <div className="absolute -bottom-2 -right-2 -z-10 h-full w-full bg-yellow-400 transition-all duration-200 group-hover:bottom-0 group-hover:right-0" />
          <span className="relative text-xl">ΕΠΕΞΕΡΓΑΣΙΑ</span>
        </button>
      </div>
    </div>
  );
};

export default FirstStage;
