import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import React from "react";
import { SubscriptionCardChart } from "./SubscriptionCardChart";

const SubscriptionCard = ({ total, percentage, clientRegistrations }: any) => {
  return (
    <Card className=" background-light900_dark200 flex h-full w-full min-w-[20vw] flex-col border-none shadow-sm shadow-neutral-500">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 ">
        <CardTitle className="text-sm font-medium">ΕΓΓΡΑΦΕΣ</CardTitle>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          className=" h-4 w-4"
        >
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      </CardHeader>
      <CardContent className="">
        <div className="text-2xl font-bold">+{total ?? 0}</div>
        <p className=" text-xs">
          {parseFloat(percentage.toFixed(2)) ?? 0} % απο τον περασμένο μήνα
        </p>
      </CardContent>
      <CardFooter className="mt-auto w-full ">
        <SubscriptionCardChart clientRegistrations={clientRegistrations} />
      </CardFooter>
    </Card>
  );
};

export default SubscriptionCard;
