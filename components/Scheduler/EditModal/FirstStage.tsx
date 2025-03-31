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
  IconMoneybag,
} from "@tabler/icons-react";
import React, { Suspense, useRef, useState } from "react";
import Link from "next/link";
import { deleteBooking } from "@/lib/actions/booking.action";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import BottomGradient from "@/components/ui/bottom-gradient";
import { FiArrowRight } from "react-icons/fi";

interface Props {
  event: any;
  pairDate: Date;
  setStage: (stage: number) => void;
  onClose: () => void;
  reset: () => void;
  price: number;
}
const FirstStage = ({
  event,
  pairDate,
  setStage,
  onClose,
  reset,
  price,
}: Props) => {
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
    <div
      className="relative flex h-full w-full flex-col gap-4 space-y-2 p-4 text-lg"
      ref={ref}
    >
      <h1 className="text-2xl text-[#e9c85ef6] ">Στοιχεία Κράτησης</h1>
      <p className="flex flex-row items-center gap-4 pl-1 text-xl font-semibold tracking-widest">
        {event.isTransport && <IconCar />}
        {event.Subject}
      </p>
      {event.clientName && (
        <div className="flex flex-row items-center gap-4  ">
          <div className="flex flex-row items-center gap-2  pl-1   ">
            <IconUser />
            {event?.clientName}
          </div>
          <Link
            className="group flex h-10 items-center gap-2 rounded-full bg-neutral-700 pl-3 pr-4 transition-all duration-300 ease-in-out hover:bg-black hover:pl-2 hover:text-white active:bg-neutral-700"
            href={{
              pathname: `/client/${event.clientId}`,
              query: { tab: "Info" },
            }}
            passHref
          >
            <span className="rounded-full bg-black p-1 text-sm transition-colors duration-300 group-hover:bg-white">
              <FiArrowRight className="translate-x-[200%] text-[0px] transition-all duration-300 group-hover:translate-x-0 group-hover:text-lg group-hover:text-black group-active:-rotate-45" />
            </span>
            <span>ΠΡΟΦΙΛ</span>
          </Link>
          <Link
            className="group flex h-10 items-center gap-2 rounded-full bg-neutral-700 pl-3 pr-4 transition-all duration-300 ease-in-out hover:bg-black hover:pl-2 hover:text-white active:bg-neutral-700"
            href={{
              pathname: `/client/${event.clientId}`,
              query: { tab: "Financial" },
            }}
            passHref
          >
            <span className="rounded-full bg-black p-1 text-sm transition-colors duration-300 group-hover:bg-white">
              <FiArrowRight className="translate-x-[200%] text-[0px] transition-all duration-300 group-hover:translate-x-0 group-hover:text-lg group-hover:text-black group-active:-rotate-45" />
            </span>
            <span>ΥΠΗΡΕΣΙΕΣ</span>
          </Link>
        </div>
      )}
      {event.mobile && (
        <p className="flex flex-row items-center gap-2  pl-1 ">
          <IconPhone />
          {event?.mobile}
        </p>
      )}
      {event.Location && (
        <p className="flex flex-row items-center gap-2 pl-1 uppercase">
          <IconMapPin />
          {event?.Location}
        </p>
      )}

      <p className="flex flex-row items-center gap-2 pl-1 ">
        <IconCalendar />
        {event.isArrival
          ? new Date(event.StartTime).toLocaleString("el-GR", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
              // 24-hour format
            })
          : new Date(pairDate).toLocaleString("el-GR", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
        -{" "}
        {!event.isArrival
          ? new Date(event.StartTime).toLocaleString("el-GR", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })
          : new Date(pairDate).toLocaleString("el-GR", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
      </p>
      <p className="flex flex-row items-center gap-2 pl-1 ">
        <IconNote />
        {event?.Description}
      </p>
      {event.dogsData?.map((dog: any) => (
        <p key={dog.dogId} className="flex flex-row items-center gap-2 pl-1 ">
          <IconHome />
          {dog.dogName}
          <IconArrowRight />
          {dog.roomName}
        </p>
      ))}
      <Suspense fallback={<IconLoader className="animate-spin" size={20} />}>
        <div className="flex flex-row items-center gap-4 pl-1 text-xl font-semibold tracking-widest">
          <IconMoneybag />
          {price} €
        </div>
      </Suspense>

      <div className="absolute bottom-0 right-4 flex w-full flex-row items-center justify-end gap-4">
        <button
          onClick={handleDelete}
          className="group/btn  relative mt-4 rounded-lg bg-dark-300 px-8 py-2 text-lg font-semibold tracking-widest text-red-600 transition hover:bg-dark-100"
        >
          <BottomGradient className="via-red-600" />
          {loading ? (
            <IconLoader className="animate-spin" size={20} />
          ) : (
            "ΔΙΑΓΡΑΦΗ"
          )}
        </button>

        <button
          onClick={() => setStage(1)}
          className="group/btn  relative mt-4  rounded-lg bg-dark-300 px-8 py-2 text-lg font-semibold tracking-widest text-yellow-500 transition hover:bg-dark-100"
        >
          <BottomGradient />
          ΕΠΕΞΕΡΓΑΣΙΑ
        </button>
      </div>
    </div>
  );
};

export default FirstStage;
