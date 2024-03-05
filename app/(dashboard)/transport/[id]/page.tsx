import { getTransportById } from "@/lib/actions/transportation.action";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React from "react";
import Image from "next/image";
import { formatDate } from "@/lib/utils";
import EditTransport from "@/components/transport/EditTransport";
const page = async ({ params }: any) => {
  const transport = await getTransportById(params.id);

  return (
    <section className="text-dark100_light900 flex flex-col gap-4">
      <h1 className="font-noto_sans text-[40px] font-extrabold">
        ΚΑΛΩΣΗΡΘΑΤΕ ΣΤΗΝ ΕΠΕΞΕΡΓΑΣΙΑ PET TAXI
      </h1>
      <Card className="background-light800_dark400 border-2 border-yellow-500">
        <CardHeader>
          <CardTitle className="font-noto_sans font-extrabold">
            Πραγματοποιείται αλλαγή στην μεταφορά με αριθμό : &nbsp; {"  "}
            {transport._id} &nbsp;{" "}
          </CardTitle>
          <CardDescription className="font-noto_sans text-lg font-bold">
            {" "}
            Πελάτης : &nbsp;
            {transport.clientId.lastName} &nbsp; {transport.clientId.firstName}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col text-lg">
          {transport.dogs.map((item: any) => {
            return (
              <span key={item.dogId}>&bull;Μεταφορά του {item.dogName} </span>
            );
          })}
          <span>
            &bull; Hμερομηνία {formatDate(new Date(transport.date), "el")}
          </span>{" "}
          <span>&bull; Ώρα άφιξης :{transport.timeArrival}</span>
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
      <EditTransport transport={transport} />
    </section>
  );
};

export default page;
