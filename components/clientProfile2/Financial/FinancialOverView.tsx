"use client";
import React, { useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@heroui/react";
import { FinancialOverviewStats } from "@/lib/actions/service.action";

const FinancialOverView = ({ client }: any) => {
  const [data, setData] = React.useState<any>({
    services: [],
    totalPaid: 0,
    totalOwes: 0,
    progress: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Call your API route
        const response = await FinancialOverviewStats({
          clientId: client?._id,
        });

        setData(response);
      } catch (error) {
        console.error("Failed to fetch financial overview:", error);
      }
    };

    if (client?._id) {
      fetchData();
    }
  }, [client]);

  // Now “data” has totalPaid, totalOwes, progress, etc.
  const { totalPaid, totalOwes } = data;
  return (
    <Skeleton isLoaded={totalPaid && totalOwes}>
      <Card className="border-0 bg-dark-100 md:col-span-2">
        <CardHeader>
          <CardTitle className="tracking-widest">
            Οικονομική Επισκόπηση
          </CardTitle>
          <CardDescription className="pt-4">
            Σύνοψη Πληρωμών Πελάτη
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1">
              <p className="text-base font-medium text-muted-foreground">
                Συνολική Οφειλή
              </p>
              <p className="text-2xl font-bold"> €{totalOwes?.toFixed(2)}</p>
            </div>
            <div className="space-y-1">
              <p className="text-base font-medium text-muted-foreground">
                Πληρωθέν Ποσό
              </p>
              <p className="text-2xl font-bold text-green-600">
                €{totalPaid?.toFixed(2)}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">
                Υπόλοιπο
              </p>
              <p className="text-2xl font-bold text-amber-600">
                €{totalOwes?.toFixed(2)}
              </p>
            </div>
          </div>

          <div className="mt-6">
            <div className="flex items-center justify-between">
              <span className="text-base font-medium">Πρόοδος Πληρωμής</span>
              <span className="text-base font-medium">
                {Math.round((totalPaid / totalOwes) * 100)}%
              </span>
            </div>
            <div className="bg-muted mt-2 h-2 w-full rounded-full">
              <div
                className="h-2 rounded-full bg-green-500"
                style={{
                  width: `${(totalPaid / totalOwes) * 100}%`,
                }}
              />
            </div>
          </div>

          <div className="mt-6 flex items-center gap-2">
            <span className="text-base font-medium">Κατάσταση:</span>
          </div>
        </CardContent>
      </Card>
    </Skeleton>
  );
};

export default FinancialOverView;
