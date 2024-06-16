import { getBookingById } from "@/lib/actions/booking.action";
import { formatDate } from "@/lib/utils";
import React, { Suspense } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { getAllRooms } from "@/lib/actions/room.action";
import EditbookingChange from "@/components/booking/EditBookingChange";
import Image from "next/image";
const EditChange = async ({ params }: any) => {
  const booking = JSON.parse(await getBookingById(params.id));
  const rooms = JSON.parse(await getAllRooms());
  function findRoomNameById(id: string) {
    const room = rooms.find((room: any) => room._id === id);
    return room ? room.name : "Room not found"; // Return room name if found, otherwise a default message
  }

  return (
    <Suspense>
      <section className="text-dark100_light900 flex flex-col gap-4">
        <h1 className="font-noto_sans text-[40px] font-extrabold">
          ΚΑΛΩΣΗΡΘΑΤΕ ΣΤΗΝ ΕΠΕΞΕΡΓΑΣΙΑ ΚΡΑΤΗΣΗΣ
        </h1>
        <Card className="background-light800_dark400 border-2 border-purple-700">
          <CardHeader>
            <CardTitle className="font-noto_sans font-extrabold">
              {" "}
              Πραγματοποιείται αλλαγή στην κράτηση με αριθμό : &nbsp; {"  "}
              {booking._id} &nbsp;{" "}
            </CardTitle>
            <CardDescription className="font-noto_sans text-lg font-bold">
              {" "}
              Πελάτης : &nbsp;
              {booking.clientId.lastName} &nbsp; {booking.clientId.firstName}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col text-lg">
            {booking.dogs.map((item: any) => {
              return (
                <span key={item.dogId}>
                  &bull; {item.dogName} ΣΤΟ ΔΩΜΑΤΙΟ{" "}
                  {findRoomNameById(item.roomId)}
                </span>
              );
            })}
            <span>
              &bull; Hμερομηνία και ώρα άφιξης :{" "}
              {formatDate(new Date(booking.fromDate), "el")} στις{" "}
              {booking.timeArrival}{" "}
            </span>{" "}
            <span>
              &bull; Hμερομηνία και ώρα αναχώρησης :{" "}
              {formatDate(new Date(booking.toDate), "el")} στις{" "}
              {booking.timeDeparture}
            </span>
          </CardContent>
          <CardFooter className="gap-2 text-lg font-extrabold">
            Προχωρήστε παρακάτω για τις εξής ενέργειες
            <Image
              src={"/assets/icons/arrow-down.svg"}
              width={30}
              height={20}
              alt="arrow-down"
              className="dark:invert"
            />
          </CardFooter>
        </Card>
        <EditbookingChange booking={booking} rooms={rooms} />
      </section>
    </Suspense>
  );
};

export default EditChange;
