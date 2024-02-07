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
const EditChange = async ({ params }: any) => {
  const booking = JSON.parse(await getBookingById(params.id));
  const rooms = JSON.parse(await getAllRooms());
  return (
    <Suspense>
      <section className="text-dark100_light900 flex flex-col gap-4">
        <h1 className="font-noto_sans text-[40px] font-extrabold">
          ΚΑΛΩΣΗΡΘΑΤΕ ΣΤΗΝ ΕΠΕΞΕΡΓΑΣΙΑ ΚΡΑΤΗΣΗΣ
        </h1>
        <Card className="background-light800_dark400 ">
          <CardHeader>
            <CardTitle className="font-noto_sans font-extrabold">
              {" "}
              Πραγματοποιείται αλλαγή στην κράτηση με αριθμό : &nbsp; {"  "}
              {booking._id} &nbsp;{" "}
            </CardTitle>
            <CardDescription className="font-noto_sans text-lg font-bold">
              {" "}
              Πελάτης : &nbsp;
              {booking.clientId.lastName} &nbsp; {booking.clientId.firstName} .
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col text-lg">
            <span>Δωμάτιο {booking.roomId.name} </span>
            <span>
              Hμερομηνία και ώρα άφιξης :{" "}
              {formatDate(new Date(booking.fromDate), "el")} στις{" "}
              {booking.timeArrival}{" "}
            </span>{" "}
            <span>
              Hμερομηνία και ώρα αναχώρησης :{" "}
              {formatDate(new Date(booking.toDate), "el")} στις{" "}
              {booking.timeDeparture}
            </span>
          </CardContent>
          <CardFooter className="text-lg font-extrabold">
            Προχωρήστε παρακάτω για τις εξής ενέργειες {"->"}
          </CardFooter>
        </Card>
        <EditbookingChange booking={booking} rooms={rooms} />
      </section>
    </Suspense>
  );
};

export default EditChange;
