"use client";

import { roomColumns } from "@/components/dataTable/bookingsTable/bookingColumn";
import { DatePickerWithRange } from "@/components/datepicker/DateRangePicker";
import dynamic from "next/dynamic";

import { createRooms, getAllRoomsAndBookings } from "@/lib/actions/room.action";
import { cn, removeKeysFromQuery, resetHours } from "@/lib/utils";
import { addDays } from "date-fns";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import { DateRange } from "react-day-picker";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { useToast } from "@/components/ui/use-toast";
const DynamicDrawer = dynamic(() => import("@/components/booking/RoomDrawer"));

const Booking = ({ clients, rooms }: any) => {
  const [rangeDate, setRangeDate] = useState<DateRange>({
    from: resetHours(new Date()),
    to: addDays(resetHours(new Date()), 1),
  });
  const path = usePathname();
  const searchParams = useSearchParams();

  const [openDrawer, setOpenDrawer] = useState(false);

  const { toast } = useToast();
  const [bookings, setBookings] = useState([]);
  const [name, setName] = useState("");
  const router = useRouter();
  const [show, setShow] = useState(false);
  useEffect(() => {
    if (!openDrawer) {
      const newUrl = removeKeysFromQuery({
        params: searchParams.toString(),
        keysToRemove: ["q"],
      });
      router.push(newUrl, { scroll: false });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openDrawer]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!rangeDate) return;
        const allrooms = await getAllRoomsAndBookings(rangeDate);
        setBookings(JSON.parse(allrooms));
      } catch (error) {
        console.error("Error fetching rooms:", error);
      }
    };
    const fetchDataWithDelay = setTimeout(fetchData, 500); // Adjust the delay as needed
    return () => clearTimeout(fetchDataWithDelay);
  }, [rangeDate]);

  const handleCreateRoom = async () => {
    try {
      const room = await createRooms(name, path);
      if (room) {
        toast({
          className: cn(
            "bg-celtic-green border-none text-white  font-noto_sans text-center flex flex-center max-w-[300px] bottom-0 left-0 fixed  "
          ),
          title: "Επιτυχία",
          description: `Επιτυχής προσθήκη δωματίου ${room.name}`,
        });
      }
    } catch (error) {
      console.error("Error creating room", error);
      toast({
        className: cn(
          "bg-red-dark border-none text-white  font-noto_sans text-center flex flex-center max-w-[300px] bottom-0 left-0 fixed  "
        ),
        title: "Αποτυχία",
        description: "Αποτυχία προσθήκης δωματίου",
      });
    } finally {
      window.location.reload();
    }
  };
  return (
    <section className="flex h-full flex-col gap-8 lg:p-8">
      {" "}
      <h1 className="text-light850_dark500 font-noto_sans text-xl font-bold max-2xl:hidden">
        ΔΙΑΧΕΙΡΗΣΗ ΚΡΑΤΗΣΕΩΝ
      </h1>
      <div className=" flex flex-col gap-4">
        <div className=" flex w-full flex-row">
          <div className="flex flex-1 flex-row gap-2">
            <DatePickerWithRange
              rangeDate={rangeDate}
              setRangeDate={setRangeDate}
              className={"self-start"}
            />
            <Button
              className="btn  self-start border-2 border-purple-600 font-noto_sans font-extrabold hover:scale-105 dark:text-white"
              onClick={() => setOpenDrawer(true)}
            >
              ΚΡΑΤΗΣΗ
            </Button>
          </div>

          <Button
            className="max-h-[38px] border-2 border-white bg-sky-blue p-2 font-noto_sans font-bold text-black hover:scale-105"
            onClick={() => setShow(!show)}
          >
            ΠΡΟΣΘΗΚΗ{" "}
            <Image
              alt="room"
              src={"assets/icons/room-available.svg"}
              width={28}
              height={25}
            />
          </Button>

          <AlertDialog onOpenChange={setShow} open={show}>
            <AlertDialogContent className="background-light800_dark400 text-dark200_light800 flex flex-col gap-4 p-8">
              <AlertDialogHeader>
                <AlertDialogTitle className="flex flex-row items-center text-[22px]">
                  Πραγματοποιείται νέα προσθήκη{" "}
                  <Image
                    alt="room"
                    src={"assets/icons/room-available.svg"}
                    width={40}
                    height={30}
                    className="invert"
                  />
                </AlertDialogTitle>
                <AlertDialogDescription>
                  <span className="flex flex-row items-center gap-2 text-[20px]">
                    Προσθέστε όνομα :{" "}
                    <Input
                      className="background-light900_dark300 text-dark200_light800  h-8 w-24 max-w-[240px]  p-0 font-noto_sans font-bold"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </span>
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter className="self-center">
                <AlertDialogCancel className="border-2 border-red-500 hover:scale-100 hover:animate-pulse">
                  Ακύρωση
                </AlertDialogCancel>
                <AlertDialogAction
                  className="border-2 border-green-500 hover:scale-105 hover:animate-pulse"
                  onClick={() => handleCreateRoom()}
                  disabled={name.length === 0}
                >
                  Συνέχεια
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
        {!openDrawer && rooms ? (
          <DataTable data={bookings} columns={roomColumns()} />
        ) : (
          <DynamicDrawer
            rooms={rooms}
            open={openDrawer}
            setOpen={setOpenDrawer}
            clients={clients}
            rangeDate={rangeDate}
          />
        )}
      </div>
    </section>
  );
};

export default Booking;
