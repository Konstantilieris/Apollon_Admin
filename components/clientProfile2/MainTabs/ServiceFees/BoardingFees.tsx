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
    <Card className="max-w-7xl px-2">
      <CardHeader>
        <h3 className="text-lg font-semibold">Ρύθμιση Τιμής Φιλοξενίας</h3>
      </CardHeader>
      <CardBody>
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {Array.from({ length: dogCount }, (_, i) => i + 1).map((count) => {
              return (
                <div key={count} className="flex items-center gap-4">
                  <Input
                    label={`${count} ${count === 1 ? "Σκύλος" : "Σκύλοι"}`}
                    type="number"
                    classNames={{
                      label: "text-base",
                    }}
                    min={0}
                    value={boardingFees[count]?.toString() ?? ""}
                    onChange={(e) => {
                      const val = e.target.value;
                      const parsed = parseFloat(val);
                      if (!isNaN(parsed)) {
                        setBoardingFee(count, parsed);
                      } else if (val === "") {
                        setBoardingFee(count, 0); // Optional: or remove the fee instead?
                      }
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
