import React from "react";

import { URLProps } from "@/types";
import { getClientById } from "@/lib/actions/client.action";
import Image from "next/image";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  findDogWithUndesiredBehavior,
  formatDate,
  formatDateString,
  isBookingLive,
  sumTotalOwesAndSpent,
} from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { clientBookings } from "@/lib/actions/booking.action";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import PendingPaid from "@/components/shared/clientProfile/PendingPaid";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import CustomerChargeSheet from "@/components/shared/sheet/CustomerChargeSheet";
import dynamic from "next/dynamic";

import UncheckPayment from "@/components/shared/clientProfile/UncheckPayment";
const DynamicAlertBehavior = dynamic(
  () => import("@/components/shared/clientProfile/AlertBehavior"),
  { ssr: false }
);
const Client = async ({ params, searchParams }: URLProps) => {
  const { id } = params;
  const [client, bookings] = await Promise.all([
    getClientById(id),
    clientBookings(id),
  ]);
  const undesired = findDogWithUndesiredBehavior(client?.dog);

  const { totalOwes, totalSpent } = sumTotalOwesAndSpent(client?.owes);
  return (
    <section className=" custom-scrollbar mb-32 flex max-h-[2400px] min-h-screen w-full flex-col justify-items-center overflow-y-scroll">
      <DynamicAlertBehavior
        status={JSON.parse(JSON.stringify(undesired))}
        client={JSON.parse(JSON.stringify(client))}
      />

      <div className="text-dark100_light900 flex  h-full flex-row items-start  overflow-x-hidden  p-8">
        <div className="flex flex-1 flex-col items-start gap-4 lg:flex-row">
          <Image
            src={"/assets/icons/clients.svg"}
            alt="profile picture"
            width={300}
            height={300}
            className="rounded-full object-cover"
          />
          <div className="mt-3">
            <h2 className="h2-bold text-dark100_light900 font-noto_sans">
              {client?.name}
            </h2>

            <p className="font-noto_sans font-semibold">
              {" "}
              ΔΗΜΙΟΥΡΓΗΘΗΚΕ {formatDateString(client?.createdAt)}
            </p>
            <div className="mt-5 flex flex-wrap items-center justify-start gap-5"></div>
          </div>
        </div>
        <div className="flex-1 ">
          <Table>
            <TableCaption>Στοιχεία Πελάτη</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Πόλη</TableHead>
                <TableHead>Διεύθυνση</TableHead>
                <TableHead className="text-center">Κατοικία</TableHead>
                <TableHead className="text-center">T.K.</TableHead>
                <TableHead className="text-center">Κινητό</TableHead>
                <TableHead>Τηλ.Οικιας</TableHead>
                <TableHead className="text-center">Τηλ.Εργασίας</TableHead>
                <TableHead>Εκτ. Επαφή</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">
                  {client?.location?.city}
                </TableCell>
                <TableCell className="text-center text-[12px]">
                  {client.location?.address}
                </TableCell>
                <TableCell className="text-center">
                  {client?.location?.residence}
                </TableCell>
                <TableCell className="text-center">
                  {client?.location?.postalCode}
                </TableCell>
                <TableCell>{client?.phone?.mobile}</TableCell>
                <TableCell>{client?.phone?.telephone}</TableCell>
                <TableCell className="text-center">
                  {client?.phone?.work_phone}
                </TableCell>
                <TableCell className="text-center">
                  {client?.emergencyContact}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Επάγγελμα</TableHead>
                <TableHead className="text-center">Email</TableHead>
                <TableHead className="text-center">Σκύλοι</TableHead>

                <TableHead className="text-center">Κτηνίατρος-Τήλ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">
                  {client?.profession}
                  {}
                </TableCell>
                <TableCell className="text-center">{client?.email}</TableCell>
                <TableCell className="flex flex-col gap-2 text-center text-[12px]">
                  {client?.dog.map((dog: any) => (
                    <HoverCard key={dog._id}>
                      <HoverCardTrigger className="rounded-lg border-2 border-white">
                        &bull; {dog?.name}
                      </HoverCardTrigger>
                      <HoverCardContent
                        align="start"
                        className="text-dark200_light900 background-light700_dark300 flex flex-col items-center"
                      >
                        <Image
                          src="/assets/icons/dog.svg"
                          alt="dog"
                          width={30}
                          height={30}
                          className="self-start"
                        />{" "}
                        {dog?.breed} <span>{dog?.gender} </span>
                        <span>Τύπος Τροφής : {dog?.food}</span>
                        <span>Συμπεριφορα : {dog?.behavior}</span>
                      </HoverCardContent>
                    </HoverCard>
                  ))}
                </TableCell>
                <TableCell className=" flex-col items-center">
                  <span className="flex flex-row justify-center">
                    &bull;{client?.vet?.name}
                  </span>
                  {client?.vet?.phone && (
                    <span className="flex flex-row justify-center">
                      <Image
                        src={"/assets/icons/phone.svg"}
                        alt="phone"
                        width={20}
                        height={20}
                      />
                      {client?.vet?.phone}{" "}
                    </span>
                  )}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>
      <div className="mr-2 flex flex-row justify-end">
        <CustomerChargeSheet client={JSON.parse(JSON.stringify(client))} />
      </div>
      <div className=" flex w-full flex-row  justify-center p-4">
        <Tabs
          defaultValue="owes"
          className="flex w-full flex-col items-center justify-center gap-6"
        >
          <TabsList className="background-light800_dark400 min-h-[42px] p-1">
            <TabsTrigger value="owes" className="tab font-bold">
              ΧΡΕΩΣΕΙΣ
            </TabsTrigger>
            <TabsTrigger value="bookings" className=" tab font-bold">
              ΚΡΑΤΗΣΕΙΣ
            </TabsTrigger>
          </TabsList>
          <TabsContent
            value="owes"
            className=" text-dark100_light900 background-light700_dark300 flex w-full flex-col gap-6 rounded-lg "
          >
            {" "}
            <ScrollArea className="w-full rounded-md border text-center lg:max-h-[350px] 2xl:max-h-[600px]">
              <div className="p-4">
                <h4 className="mb-4   text-[24px] font-medium  leading-none underline decoration-black decoration-2 underline-offset-8 dark:decoration-purple-300">
                  ΟΦΕΙΛΕΣ-{client?.lastName}
                </h4>
                <div className="flex w-full flex-row justify-center gap-2 border-b-2 border-black dark:border-white">
                  <h1>Συνολικό Ποσό Οφειλής : {totalOwes}€</h1>
                  <h1>Συνολικό Ποσό Πληρωμένων : {totalSpent}€</h1>
                </div>
                {client.owes.map((item: any) => (
                  <div key={item._id}>
                    <div
                      key={item._id}
                      className="ml-32 flex max-h-[70px] min-h-[50px] flex-row items-center justify-start gap-2"
                    >
                      &bull;{" "}
                      <span className="flex  flex-row items-center ">
                        {" "}
                        Ποσό :{item.amount}
                        <Image
                          src={"/assets/icons/euro2.svg"}
                          alt="euro"
                          width={20}
                          height={20}
                        />
                      </span>
                      <span className="flex flex-row items-center gap-2">
                        {" "}
                        Ημερομηνία: {formatDate(item?.date, "el")}{" "}
                        <Image
                          src={"/assets/icons/calendar.svg"}
                          alt="calendar"
                          width={20}
                          height={20}
                        />
                      </span>
                      <span className="flex flex-row items-center gap-2">
                        {" "}
                        Περιγραφή: {item.serviceType}{" "}
                        <Image
                          src={"/assets/icons/description.svg"}
                          alt="description"
                          width={20}
                          height={20}
                          className="mt-2 self-end"
                        />
                      </span>
                      <span>
                        {" "}
                        Κατάσταση Πληρωμής :{" "}
                        {item.paid ? "Ολοκληρωμένη " : "Εκκρεμή"}
                      </span>
                      {!item.paid ? (
                        <PendingPaid
                          clientId={JSON.parse(JSON.stringify(client._id))}
                          item={JSON.parse(JSON.stringify(item))}
                          firstName={client.firstName}
                          lastName={client.lastName}
                        />
                      ) : (
                        <>
                          <UncheckPayment
                            clientId={JSON.parse(JSON.stringify(client._id))}
                            item={JSON.parse(JSON.stringify(item))}
                          />
                          <span>
                            Πληρώθηκε : {formatDate(item?.paymentDate, "el")}
                          </span>
                        </>
                      )}
                    </div>
                    <Separator className="my-2 bg-black dark:bg-white" />
                  </div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
          <TabsContent
            value="bookings"
            className=" text-dark100_light900 background-light700_dark300 flex w-full flex-col gap-6 rounded-lg "
          >
            <ScrollArea className="w-full rounded-md border text-center lg:max-h-[350px] 2xl:max-h-[600px]">
              <div className="p-4">
                <h4 className="mb-4   text-[24px] font-medium  leading-none underline decoration-black decoration-2 underline-offset-8 dark:decoration-purple-300">
                  ΚΡΑΤΗΣΕΙΣ-{client.lastName}
                </h4>

                {bookings?.map((booking: any) => (
                  <div key={booking._id}>
                    <div key={booking._id} className="flex flex-row gap-2 ">
                      {isBookingLive(booking) ? "Ενεργή" : "Ανενεργή"}
                      &bull;
                      <span>ID:{JSON.parse(JSON.stringify(booking._id))}</span>
                      <span>
                        Ημερομηνία:
                        {formatDate(new Date(booking?.fromDate), "el")}-
                        {formatDate(new Date(booking?.toDate), "el")}
                      </span>
                      <span className="flex flex-row gap-2">
                        ΣΚΥΛΙΑ:
                        {booking.dogs.map((dog: any) => (
                          <h1 key={dog._id}>{dog.dogName}</h1>
                        ))}
                      </span>
                      <span>
                        {booking.flag ? "ΜΕ ΜΕΤΑΦΟΡΑ" : "ΧΩΡΙΣ ΜΕΤΑΦΟΡΑ"}
                      </span>
                      <span>
                        Δημιουργία Κράτησης:{" "}
                        {formatDate(new Date(booking?.createdAt), "el")}
                      </span>
                      <span>Συνολικη Τιμη:{booking?.totalAmount}€</span>
                    </div>
                    <Separator className="my-2 bg-black" />
                  </div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};

export default Client;
