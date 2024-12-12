import { Checkbox } from "@/components/ui/checkbox";
import { useBookingStore } from "@/hooks/booking-store";
import React from "react";

const CheckBoxDay = () => {
  const { extraDay, setExtraDay } = useBookingStore();

  return (
    <div className="mt-8 flex items-center space-x-2 pl-8">
      <Checkbox
        id="terms"
        className="h-6 w-6"
        checked={extraDay}
        onCheckedChange={(value: boolean) => setExtraDay(value)}
      />
      <label
        htmlFor="terms"
        className="font-sans text-lg  leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        Χρέωση 24ωρη
      </label>
    </div>
  );
};

export default CheckBoxDay;
