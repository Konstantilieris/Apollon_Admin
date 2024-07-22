"use client";
import React from "react";

import Pagination from "../shared/Pagination";
import Room from "../shared/cards/Room";

import { IClient } from "@/database/models/client.model";
type AvailableRoomProps = {
  rooms: any;
  client: IClient;
  isNext: boolean;
  pageNumber: number;
};
const AvailableRooms = ({
  rooms,
  client,
  isNext,
  pageNumber,
}: AvailableRoomProps) => {
  return (
    <div className="mb-20 flex w-full flex-col items-center justify-center gap-2 px-8 py-4">
      {rooms.map((room: any) => (
        <Room room={room} client={client} key={room.name} />
      ))}

      <Pagination pageNumber={pageNumber} isNext={isNext} />
    </div>
  );
};

export default AvailableRooms;
