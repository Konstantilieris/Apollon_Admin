"use client";
import React, { useEffect } from "react";
import { Button } from "../ui/button";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useSearchParams } from "next/navigation";
import { checkExistingBooking } from "@/lib/actions/booking.action";
import {
  calculateTotalPrice,
  cn,
  formatDateUndefined2,
  intToDate,
  setLocalTime,
} from "@/lib/utils";
import {} from "../ui/use-toast";
import { Input } from "../ui/input";

const CreateBook = ({ dogsInRooms, setDogsInRooms, client }: any) => {
  const searchParams = useSearchParams();
  const [show, setShow] = React.useState(false);
  const [validate, setValidate] = React.useState({ check: false, message: "" });

  const [costDeparture, setCostDeparture] = React.useState(0);
  const [costArrival, setCostArrival] = React.useState(0);

  const [change, setChange] = React.useState(false);
  useEffect(() => {
    const validateBooking = async () => {
      const frDate = intToDate(+searchParams.get("fr")!);
      const today = new Date();
      frDate.setHours(0, 0, 0, 0);
      today.setHours(0, 0, 0, 0);
      if (frDate < today) {
        setValidate({ check: true, message: "Λάθος ημερομηνίες" });
      } else {
        const check = await checkExistingBooking({
          clientId: client._id,
          rangeDate: {
            from: intToDate(+searchParams.get("fr")!),
            to: intToDate(+searchParams.get("to")!),
          },
        });
        setValidate({
          check,
          message: check ? "Έχει κράτηση τις συγκεκριμένες ημερομηνίες" : "",
        });
      }
    };
    if (searchParams.get("fr") && searchParams.get("to")) {
      validateBooking();
    }
  }, [searchParams.get("fr"), searchParams.get("to")]);

  const fromDate = setLocalTime(
    intToDate(+searchParams.get("fr")!),
    searchParams.get("tm1")!
  );
  const toDate = setLocalTime(
    intToDate(+searchParams.get("to")!),
    searchParams.get("tm2")!
  );
  const [totalAmount, setTotalAmount] = React.useState(
    calculateTotalPrice({
      fromDate,
      toDate,
      dailyPrice: 30,
    })
  );
  return (
    <>
      {!validate.check ? (
        <Button
          onClick={() => setShow(true)}
          className={cn(
            "font-noto_sans  px-8 py-2 rounded-md bg-purple-700 min-h-[45px] text-white font-bold transition duration-200 hover:bg-white dark:hover:bg-dark-500 dark:hover:text-white hover:text-black border-2 border-transparent hover:border-purple-700  ",
            {
              "opacity-50 text-red-400 cursor-not-allowed":
                !searchParams.has("fr") && !searchParams.has("to"),
            },
            {
              "opacity-100 hover:scale-105":
                searchParams.has("fr") && searchParams.has("to"),
            }
          )}
          disabled={
            dogsInRooms.length === 0 ||
            !searchParams.get("fr") ||
            !searchParams.get("to") ||
            !searchParams.get("tm1") ||
            !searchParams.get("tm2")
          }
        >
          ΚΡΑΤΗΣΗ
        </Button>
      ) : (
        <span className="animate-pulse rounded-lg bg-light-700 p-2 font-bold text-red-500 dark:bg-dark-500">
          {validate?.message}
        </span>
      )}
      <AlertDialog onOpenChange={setShow} open={show}>
        <AlertDialogContent className="background-light900_dark300 text-dark100_light900 min-w-[650px] font-noto_sans">
          <AlertDialogHeader className="w-full">
            <AlertDialogTitle>Δημιουργία Κράτησης</AlertDialogTitle>
            <div className="flex flex-col items-start justify-center gap-2">
              <span>
                {" "}
                Απο {formatDateUndefined2(fromDate, "el")}{" "}
                {searchParams.has("flag1") && " με μεταφορα"}
              </span>
              <span>
                {" "}
                Μέχρι {formatDateUndefined2(toDate, "el")}{" "}
                {searchParams.has("flag2") && " με μεταφορα"}
              </span>
              <span>
                {dogsInRooms.map((item: any) => (
                  <span key={item.dogId}>
                    {item.dogName} στο δωμάτιο {item.roomName}
                  </span>
                ))}
              </span>
              {searchParams.has("flag1") && (
                <span className="flex flex-row items-center gap-2 ">
                  <Input
                    className="background-light850_dark100 text-light850_dark500 max-w-[90px]"
                    type="number"
                    value={costArrival || ""}
                    onChange={(e) => setCostArrival(parseInt(e.target.value))}
                  />{" "}
                  <span className="flex flex-row">
                    Χρέωση Παραλαβής {costArrival || 0} €{" "}
                  </span>
                </span>
              )}{" "}
              {searchParams.has("flag2") && (
                <span className="flex flex-row items-center gap-2">
                  <Input
                    className="background-light850_dark100 text-light850_dark500 max-w-[90px]"
                    value={costDeparture || ""}
                    onChange={(e) => setCostDeparture(parseInt(e.target.value))}
                  />
                  <span className="flex flex-row">
                    Χρέωση Παράδοσης {costDeparture || 0} €{" "}
                  </span>
                </span>
              )}
              <div className="flex flex-col gap-2">
                {(searchParams.has("flag1") || searchParams.has("flag2")) && (
                  <span>
                    Σύνολο μεταφορών {(costArrival || 0) + (costDeparture || 0)}
                  </span>
                )}
                <span>
                  Χρέωση ανα ημέρα 30 € - Σύνολικο κόστος διαμονής{" "}
                  {totalAmount || 0} €
                </span>
                <div className="mt-2 flex flex-row items-center  gap-2">
                  <Button
                    onClick={() => setChange(!change)}
                    className="background-light700_dark400 text-dark200_light800 rounded-lg"
                  >
                    Διαμόρφωση Κόστους Διαμονής
                  </Button>
                  {change && (
                    <Input
                      className="background-light850_dark100 text-light850_dark500"
                      type="number"
                      value={totalAmount || ""}
                      onChange={(e) => setTotalAmount(parseInt(e.target.value))}
                    />
                  )}
                </div>
              </div>
            </div>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border border-red-400 hover:scale-105 hover:border-red-600">
              ΑΚΥΡΩΣΗ
            </AlertDialogCancel>
            <Button className="border border-green-400 hover:scale-105 hover:border-green-600">
              ΚΑΤΑΧΩΡΗΣΗ
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default CreateBook;
