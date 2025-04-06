import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import React from "react";
import { RevenueCardChart } from "./RevenueCardChart";
import { formatCurrency } from "@/lib/utils";

const RevenueCard = ({ total, percentage, chartData }: any) => {
  return (
    <Card className="background-light900_dark200 flex h-full w-full min-w-[20vw] flex-col border-none shadow-sm shadow-neutral-500">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">ΕΣΟΔΑ</CardTitle>€
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{formatCurrency(total) ?? 0} </div>
        <p className=" text-xs ">
          {parseFloat(percentage.toFixed(2)) ?? 0}% από τον προηγούμενο μήνα
        </p>
      </CardContent>
      <CardFooter className="mt-auto ">
        <RevenueCardChart chartData={chartData} />
      </CardFooter>
    </Card>
  );
};

export default RevenueCard;
