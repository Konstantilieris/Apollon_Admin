"use client";

import { roomColumns } from "@/components/dataTable/bookingsTable/bookingColumn";
import { DatePickerWithRange } from "@/components/datepicker/DateRangePicker";

import RoomDrawer from "@/components/shared/RoomDrawer";
import { DataTable } from "@/components/ui/data-table";

import { getAllClientsByQuery } from "@/lib/actions/client.action";
import { getAllRoomsAndBookings } from "@/lib/actions/room.action";
import { removeKeysFromQuery, replacePercent20, resetHours } from "@/lib/utils";
import { addDays } from "date-fns";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { DateRange } from "react-day-picker";

const Page = () => {
  const [rangeDate, setRangeDate] = useState<DateRange>({
    from: resetHours(new Date()),
    to: addDays(resetHours(new Date()), 1),
  });
  const searchParams = useSearchParams();
  const [clients, setClients] = useState();
  const [openDrawer, setOpenDrawer] = useState(false);
  const [rooms, setRooms] = useState<any>([]);
  const [room, setRoom] = useState();
  const [roomId, setRoomId] = useState<any>();
  const router = useRouter();
  const handleRoomId = (roomId: any) => {
    setRoomId(roomId);
  };
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
        const roomsData = await getAllRoomsAndBookings(rangeDate);
        setRooms(JSON.parse(roomsData));
      } catch (error) {
        console.error("Error fetching rooms:", error);
      }
    };
    const fetchDataWithDelay = setTimeout(fetchData, 500); // Adjust the delay as needed
    return () => clearTimeout(fetchDataWithDelay);
  }, [rangeDate]);
  useEffect(() => {
    const searchQuery = replacePercent20(searchParams.get("q"));

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
    setRoom(rooms.find((item: any) => item._id === roomId));
  }, [roomId, rooms]);

  return (
    <section className="flex flex-col gap-8 p-4">
      {" "}
      <h1 className="text-light850_dark500 font-noto_sans text-xl font-bold">
        ΔΙΑΧΕΙΡΗΣΗ ΚΡΑΤΗΣΕΩΝ
      </h1>
      <div className="flex flex-col items-center gap-4">
        <DatePickerWithRange
          rangeDate={rangeDate}
          setRangeDate={setRangeDate}
          className={"self-start"}
        />

        {!openDrawer ? (
          <DataTable
            data={rooms}
            columns={roomColumns(handleRoomId, setOpenDrawer)}
          />
        ) : (
          <RoomDrawer
            room={room}
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
