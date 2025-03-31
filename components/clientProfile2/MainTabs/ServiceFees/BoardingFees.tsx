// BoardingFees.tsx
import React from "react";
import { Card, CardHeader, CardBody, Input } from "@heroui/react";

import { useServiceFeesStore } from "@/hooks/serviceFees.store";

interface BoardingFeesProps {
  dogCount: number;
}

export function BoardingFees({ dogCount }: BoardingFeesProps) {
  const { boardingFees, setBoardingFee } = useServiceFeesStore((state) => ({
    boardingFees: state.boardingFees,
    setBoardingFee: state.setBoardingFee,
    saveAllFees: state.saveAllFees, // in case you want to do a quick save
  }));

  return (
    <Card>
      <CardHeader>
        <h3 className="text-lg font-semibold">Ρύθμιση Τιμής Φιλοξενίας</h3>
      </CardHeader>
      <CardBody>
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {Array.from({ length: dogCount }, (_, i) => i + 1).map((count) => {
              const currentFee = boardingFees[count] ?? "";
              console.log("count");
              return (
                <div key={count} className="flex items-center gap-4">
                  <Input
                    label={`${count} ${count === 1 ? "Σκύλος" : "Σκύλοι"}`}
                    type="number"
                    min={0}
                    value={currentFee.toString()}
                    onValueChange={(val) => {
                      const num = parseFloat(val) || 0;
                      setBoardingFee(count, num);
                    }}
                    startContent={
                      <div className="pointer-events-none flex items-center">
                        <span className="text-small text-default-400">€</span>
                      </div>
                    }
                    placeholder="Εισάγετε χρέωση"
                  />
                </div>
              );
            })}
          </div>

          {/* Example optional: quick save just for boarding */}
          <div className="mt-4 flex justify-end"></div>
        </div>
      </CardBody>
    </Card>
  );
}
