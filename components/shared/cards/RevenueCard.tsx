import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import React from "react";

const RevenueCard = ({ total, percentage }: any) => {
  return (
    <Card className="max-h-[20vh]">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">ΕΣΟΔΑ</CardTitle>€
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{total ?? 0} €</div>
        <p className=" text-xs ">{percentage ?? 0}% από τον προηγούμενο μήνα</p>
      </CardContent>
    </Card>
  );
};

export default RevenueCard;
