import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { countClientsByMonth } from "@/lib/actions/client.action";
import { ClientChart } from "@/components/shared/charts/ClientChart";
import { countBookingsByMonth } from "@/lib/actions/booking.action";
import { BookingChart } from "@/components/shared/charts/BookingChart";

const Page = async ({ searchParams }: { searchParams: { year: string } }) => {
  const [monthlyClients, monthlyBookings] = await Promise.all([
    countClientsByMonth({
      year: searchParams.year ? Number(searchParams.year) : undefined,
    }),
    countBookingsByMonth({
      year: searchParams.year ? Number(searchParams.year) : undefined,
    }),
  ]);

  return (
    <div className="mt-2 flex h-full w-full bg-dark-100 p-4">
      <Tabs
        defaultValue="bookings"
        className=" text-dark100_light900 flex min-h-[500px] w-full min-w-[1200px] flex-col gap-6 rounded-lg p-2 dark:bg-dark-100"
      >
        <TabsList className="min-h-[42px] max-w-[400px] self-center p-1 dark:bg-dark-200">
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

export default Page;
