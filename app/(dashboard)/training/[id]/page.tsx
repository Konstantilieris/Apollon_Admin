import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React, { Suspense } from "react";
import Image from "next/image";
import { getTrainingById } from "@/lib/actions/training.action";
import { formatDate } from "@/lib/utils";

import EditTraining from "@/components/training/EditTraining";
const page = async ({ params }: any) => {
  const training = await getTrainingById(params.id);
  return (
    <Suspense>
      <section className="text-dark100_light900 flex flex-col gap-4">
        <h1 className="font-noto_sans text-[40px] font-extrabold">
          ΚΑΛΩΣΗΡΘΑΤΕ ΣΤΗΝ ΕΠΕΞΕΡΓΑΣΙΑ ΕΚΠΑΙΔΕΥΣΗΣ
        </h1>
        <Card className="background-light800_dark400 border-2 border-purple-700">
          <CardHeader>
            <CardTitle className="font-noto_sans font-extrabold">
              Πραγματοποιείται αλλαγή στην εκπαίδευση με αριθμό : &nbsp; {"  "}
              {training._id} &nbsp;{" "}
            </CardTitle>
            <CardDescription className="font-noto_sans text-lg font-bold">
              {" "}
              Πελάτης : &nbsp;
              {training.clientId.lastName} &nbsp; {training.clientId.firstName}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col text-lg">
            {training.dogs.map((item: any) => {
              return (
                <span key={item.dogId}>
                  &bull;Εκπαιδευση του {item.dogName}{" "}
                </span>
              );
            })}
            <span>
              &bull; Hμερομηνία {formatDate(new Date(training.date), "el")}
            </span>{" "}
            <span>&bull; Ώρα άφιξης :{training.timeArrival}</span>
            <span>&bull; Ώρα αναχώρησης :{training.timeDeparture}</span>
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
        <EditTraining training={training} />
      </section>
    </Suspense>
  );
};

export default page;
