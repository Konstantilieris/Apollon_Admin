import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { countClientsByMonth } from "@/lib/actions/client.action";
import ClientChart from "@/components/shared/charts/ClientChart";

const page = async () => {
  const clientsforEachmonth = await countClientsByMonth();

  return (
    <div className="mt-2 flex h-full w-full justify-center text-center">
      <Tabs defaultValue="account" className="w-[400px]">
        <TabsList className="background-light800_dark400 min-h-[42px] p-1">
          <TabsTrigger value="account" className="tab font-bold">
            ΠΕΛΑΤΕΣ
          </TabsTrigger>
          <TabsTrigger value="password" className="tab font-bold">
            ΚΡΑΤΗΣΕΙΣ
          </TabsTrigger>
        </TabsList>
        <TabsContent
          value="account"
          className=" text-dark100_light900 background-light700_dark300 flex min-h-[600px] w-full min-w-[600px] flex-col gap-6 rounded-lg"
        >
          <ClientChart chartData={clientsforEachmonth} />
        </TabsContent>
        <TabsContent
          value="password"
          className=" text-dark100_light900 background-light700_dark300 flex w-full flex-col gap-6 rounded-lg "
        ></TabsContent>
      </Tabs>
    </div>
  );
};

export default page;
