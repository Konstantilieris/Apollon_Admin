import RoomBooking from "@/components/shared/RoomBooking/RoomBooking";
import { getAllClientsByQuery } from "@/lib/actions/client.action";

import { getAllRooms } from "@/lib/actions/room.action";
import { replacePercent20 } from "@/lib/utils";
import React from "react";

const page = async ({ searchParams }: any) => {
  const rooms = await getAllRooms();
  const allRooms = JSON.parse(rooms);
  const chosenDate: Date = new Date(searchParams.d);
  const query = replacePercent20(searchParams.q);

  const allClients = await getAllClientsByQuery({ searchQuery: query });
  const clients = JSON.parse(allClients);

  return (
    <div className="flex flex-col  py-2">
      <h1 className="font-noto_sans text-xl font-bold">Όλα Τα Δωμάτια</h1>
      <RoomBooking rooms={allRooms} chosenDate={chosenDate} clients={clients} />
    </div>
  );
};

export default page;
