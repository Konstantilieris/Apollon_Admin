"use client";

import { useEffect, useState } from "react";
import TimeSlider from "../shared/timepicker/time-slider";
import ToggleTransport from "../booking/ToggleTransport";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { cn, formUrlQuery } from "@/lib/utils";
import moment from "moment";
import { updateTnt } from "@/lib/actions/booking.action";
import { useToast } from "../ui/use-toast";
interface updateTNTProps {
  initialDate: Date;
  hasTransport: boolean;
  type: string;
  transportFee: number;
  id: string;
}

const UpdateTNT = ({
  initialDate,
  id,
  hasTransport,
  transportFee,
  type,
}: updateTNTProps) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const path = usePathname();
  const { toast } = useToast();
  const extractTime = moment(initialDate).format("HH:mm");
  const [time, setTime] = useState<string>(extractTime);
  useEffect(() => {
    if (!hasTransport) return;
    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      key: type,
      value: "true",
    });

    router.push(newUrl, { scroll: false });
  }, [hasTransport]);
  const handleTimeChange = async () => {
    try {
      const res = await updateTnt({
        id,
        type,
        time,
        initialDate,
        oldTState: hasTransport,
        newTState: searchParams.has(type),
        transportFee,
        path,
      });
      const updated = JSON.parse(res);
      if (updated) {
        toast({
          className: cn(
            "bg-celtic-green border-none text-white   text-center flex flex-center max-w-[300px] bottom-0 left-0 fixed  "
          ),
          title: "Επιτυχία",
          description: "Η κράτηση τροποποιήθηκε",
        });
      }
    } catch (error) {
      toast({
        className: cn(
          "bg-red-dark border-none text-white   text-center flex flex-center max-w-[300px] bottom-0 left-0 fixed  "
        ),
        title: "Αποτυχία τροποποίησης",
        description: `${error}`,
      });
    }
  };

  return (
    <div className="mt-6 flex max-h-[20vh] w-full flex-col items-start gap-1 rounded-lg bg-light-800 px-4 pt-5 dark:bg-dark-100">
      <div className="flex w-full flex-row items-center justify-between pr-6">
        <h1 className="text-lg text-dark-100 dark:text-green-300">
          {" "}
          Άλλαξε Χρόνο{" "}
          {type === "flag1"
            ? searchParams.get(type)
              ? "Παραλαβής"
              : "Άφιξης"
            : searchParams.get(type)
              ? "Παράδοσης"
              : "Αναχώρησης"}
        </h1>
        <div className="flex flex-row items-center gap-2">
          <ToggleTransport type={type} hasTransport={hasTransport} />
          <span
            className={cn(
              "dark:text-light-700 text-dark-100 bg-light-700 dark:bg-dark-300  rounded-lg p-2 ",
              {
                "dark:text-green-300 text-green-600 font-semibold":
                  searchParams.get(type),
              }
            )}
          >
            {transportFee || 0} €
          </span>
        </div>
      </div>

      <TimeSlider
        initialTime={extractTime}
        onTimeChange={setTime}
        handleClick={handleTimeChange}
      />
    </div>
  );
};
export default UpdateTNT;
