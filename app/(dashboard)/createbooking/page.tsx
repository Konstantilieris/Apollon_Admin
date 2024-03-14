"use client";

import { roomColumns } from "@/components/dataTable/bookingsTable/bookingColumn";
import { DatePickerWithRange } from "@/components/datepicker/DateRangePicker";
import dynamic from "next/dynamic";

import { getAllClientsByQuery } from "@/lib/actions/client.action";
import { getAllRooms, getAllRoomsAndBookings } from "@/lib/actions/room.action";
import { removeKeysFromQuery, replacePercent20, resetHours } from "@/lib/utils";
import { addDays } from "date-fns";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { DateRange } from "react-day-picker";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";

const DynamicDrawer = dynamic(() => import("@/components/shared/RoomDrawer"));
const Page = () => {
  const [rangeDate, setRangeDate] = useState<DateRange>({
    from: resetHours(new Date()),
    to: addDays(resetHours(new Date()), 1),
  });
  const searchParams = useSearchParams();
  const [clients, setClients] = useState();
  const [openDrawer, setOpenDrawer] = useState(false);
  const [rooms, setRooms] = useState<any>([]);

  const [bookings, setBookings] = useState([]);

  const router = useRouter();

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
  useEffect(() => {
    const searchQuery = replacePercent20(searchParams.get("q"));
    console.log(searchQuery);
    const fetchData = async () => {
      try {
        // Call getAllRoomsAndBookings and wait for the result
        const clientsData = await getAllClientsByQuery(searchQuery);
        setClients(JSON.parse(clientsData));
      } catch (error) {
        console.error("Error fetching rooms:", error);
      }
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams.get("q")]);
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const allRooms = await getAllRooms();
        setRooms(JSON.parse(allRooms));
      } catch (error) {
        console.error("Error fetching rooms:", error);
      }
    };
    fetchRooms();
  }, []);

  return (
    <section className="flex flex-col gap-8 p-4">
      {" "}
      <h1 className="text-light850_dark500 font-noto_sans text-xl font-bold">
        ΔΙΑΧΕΙΡΗΣΗ ΚΡΑΤΗΣΕΩΝ
      </h1>
      <div className="flex flex-col items-center gap-4">
        <div className="flex flex-row gap-2 self-start">
          <DatePickerWithRange
            rangeDate={rangeDate}
            setRangeDate={setRangeDate}
            className={"self-start"}
          />
          <Button
            className="btn  border-2 border-purple-600 font-noto_sans font-extrabold hover:scale-105 dark:text-white"
            onClick={() => setOpenDrawer(true)}
          >
            ΚΡΑΤΗΣΗ
          </Button>
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

export default Page;
