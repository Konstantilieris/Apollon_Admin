"use client";
import React, { useState } from "react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import TimePicker from "./TimePicker";
import ToggleTransport from "./ToggleTransport";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "../ui/button";
import Image from "next/image";
import {
  cn,
  formCombinedParams,
  formatDateString2,
  intToDate,
  removeKeysFromQuery,
} from "@/lib/utils";
const Transport = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [tm1, setTm1] = useState<Date | null>(null);
  const [tm2, setTm2] = useState<Date | null>(null);
  const [check1, setCheck1] = useState(false);
  const [check2, setCheck2] = useState(false);
  const [open, setOpen] = useState(false);
  const handleDeleteURL = () => {
    const newUrl = removeKeysFromQuery({
      params: searchParams.toString(),
      keysToRemove: ["flag1", "flag2", "tm1", "tm2"],
    });
    router.push(newUrl, { scroll: false });
    setTm1(null);
    setTm2(null);
  };
  const handleTimeUrl = () => {
    const newUrl = formCombinedParams(searchParams.toString(), {
      tm1: tm1?.getHours().toString() + "-" + tm1?.getMinutes().toString()!,
      tm2: tm2?.getHours().toString() + "-" + tm2?.getMinutes().toString()!,
    });
    router.push(newUrl, { scroll: false });
    setOpen(false);
  };

  return (
    <AlertDialog onOpenChange={setOpen} open={open}>
      <AlertDialogTrigger
        className={cn(
          "font-noto_sans  relative p-[3px] ",
          {
            "opacity-50 text-red-400 cursor-not-allowed":
              !searchParams.has("fr") && !searchParams.has("to"),
          },
          {
            "opacity-100 hover:scale-105":
              searchParams.has("fr") && searchParams.has("to"),
          }
        )}
        disabled={!searchParams.has("fr") && !searchParams.has("to")}
      >
        <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 " />
        <div className="group relative  rounded-[6px] bg-light-700 px-8  py-2 text-black transition duration-200 hover:bg-transparent dark:bg-dark-300 dark:text-white ">
          ΧΡΟΝΟΔΙΑΓΡΑΜΜΑ
        </div>
      </AlertDialogTrigger>
      <AlertDialogContent className="text-dark200_light900 min-h-[376px] border   border-orange-500 bg-light-700 font-noto_sans dark:bg-dark-200">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-center text-xl font-semibold">
            ΧΡΟΝΟΔΙΑΓΡΑΜΜΑ ΜΕΤΑΚΙΝΗΣΗΣ
          </AlertDialogTitle>
          <div className="flex flex-row items-center justify-center gap-2 ">
            <span className="flex h-full min-w-[150px] flex-col items-center gap-2 ">
              <h1 className=" text-lg font-medium">
                {searchParams.get("flag1") ? "ΠΑΡΑΛΑΒΗ" : "ΑΦΙΞΗ"}{" "}
                {formatDateString2(intToDate(+searchParams.get("fr")!))}
              </h1>

              <div className="flex flex-row items-center">
                <Button
                  className={cn(
                    "relative flex max-h-[28px] min-w-[22px] cursor-pointer items-center rounded-2xl bg-slate-400/80 py-[0.1px] hover:bg-slate-500 hover:animate-pulse hover:cursor-pointer dark:bg-slate-500 dark:bg-opacity-80 dark:hover:bg-slate-500 dark:hover:animate-pulse dark:hover:cursor-pointer",
                    { "opacity-50": check2 }
                  )}
                  onClick={() => setCheck1(!check1)}
                >
                  <Image
                    src="/assets/icons/clock2.svg"
                    alt="clock"
                    width={20}
                    height={20}
                    className="hover:animate-spin"
                  />
                </Button>
                <ToggleTransport type={"flag1"} />
              </div>
              <TimePicker setTime={setTm1} check={check1} time={tm1} />
            </span>
            <span className="flex h-full min-w-[150px] flex-col items-center gap-2">
              <h1 className=" text-lg font-medium">
                {searchParams.get("flag2") ? "ΠΑΡΑΔΟΣΗ" : "ΑΝΑΧΩΡΗΣΗ"}{" "}
                {formatDateString2(intToDate(+searchParams.get("to")!))}
              </h1>

              <div className="flex flex-row items-center">
                <Button
                  className={cn(
                    "relative flex max-h-[28px] min-w-[22px] cursor-pointer items-center rounded-2xl bg-slate-400/80 py-[0.1px] hover:bg-slate-500 hover:animate-pulse hover:cursor-pointer dark:bg-slate-500 dark:bg-opacity-80 dark:hover:bg-slate-500 dark:hover:animate-pulse dark:hover:cursor-pointer",
                    { "opacity-50": check2 }
                  )}
                  onClick={() => setCheck2(!check2)}
                >
                  <Image
                    src="/assets/icons/clock2.svg"
                    alt="clock"
                    width={20}
                    height={20}
                    className="hover:animate-spin"
                  />
                </Button>
                <ToggleTransport type={"flag2"} />
              </div>
              <TimePicker setTime={setTm2} check={check2} time={tm2} />
            </span>
          </div>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex items-end self-end">
          <AlertDialogCancel
            onClick={handleDeleteURL}
            className="border border-red-400 hover:scale-105 hover:border-red-600"
          >
            ΑΚΥΡΩΣΗ
          </AlertDialogCancel>
          <Button
            className="border border-green-400 hover:scale-105 hover:border-green-600"
            disabled={!tm1 || !tm2}
            onClick={handleTimeUrl}
          >
            ΚΑΤΑΧΩΡΗΣΗ
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
export default Transport;
