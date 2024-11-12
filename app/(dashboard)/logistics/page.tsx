import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { countClientsByMonth } from "@/lib/actions/client.action";
import ClientChart from "@/components/shared/charts/ClientChart";
import { countBookingsByMonth } from "@/lib/actions/booking.action";
import { BookingChart } from "@/components/shared/charts/BookingChart";

const page = async () => {
  const [monthlyClients, monthlyBookings] = await Promise.all([
    countClientsByMonth(),
    countBookingsByMonth({}),
  ]);
  console.log(monthlyBookings);

  return (
    <div className="mt-2 flex w-full p-4 h-full bg-dark-100">
      <Tabs
        defaultValue="bookings"
        className=" text-dark100_light900 dark:bg-dark-100 flex min-h-[500px] w-full min-w-[1200px] flex-col gap-6 rounded-lg p-2"
      >
        <TabsList className="dark:bg-dark-200 min-h-[42px] max-w-[400px] self-center p-1">
          <TabsTrigger value="clients" className="tab font-bold">
            ΠΕΛΑΤΕΣ
          </TabsTrigger>
          <TabsTrigger value="bookings" className="tab font-bold">
            ΚΡΑΤΗΣΕΙΣ
          </TabsTrigger>
        </TabsList>
        <TabsContent value="clients" className="max-h-[660px] ">
          <ClientChart chartData={monthlyClients} />
        </TabsContent>
        <TabsContent value="bookings" className="max-h-[660px]">
          <BookingChart chartData={monthlyBookings} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default page;
