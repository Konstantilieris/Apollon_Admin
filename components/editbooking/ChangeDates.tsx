"use client";
import React, { useState, useEffect, useRef } from "react";
import "rc-slider/assets/index.css";
import Slider from "rc-slider";
import moment from "moment"; // For date manipulation
import "./slider.module.css";
import { calculateTotalPrice, cn } from "@/lib/utils";

import { updateBookingDates } from "@/lib/actions/booking.action";
import { useToast } from "../ui/use-toast";
import { usePathname } from "next/navigation";

interface UpdateDateProps {
  initialStartDate: string;
  initialEndDate: string;
  transportFee: number;
  taxiArrival: boolean;
  taxiDeparture: boolean;
  bookingFee: number;
  id: string;
  amount: number;
}

const ChangeDates = ({
  initialStartDate,
  initialEndDate,
  transportFee,
  taxiArrival,
  taxiDeparture,
  bookingFee,
  id,
  amount,
}: UpdateDateProps) => {
  const isFirstRender = useRef(true);
  const pathname = usePathname();
  const [totalAmount, setAmount] = useState(amount);
  const taxiArrivalFee = taxiArrival ? transportFee : 0;
  const taxiDepartureFee = taxiDeparture ? transportFee : 0;
  const bookingStartDate = moment(initialStartDate);
  const bookingEndDate = moment(initialEndDate);

  // Define the slider date range (5 days before and after the booking dates)
  const startDate = bookingStartDate.clone().subtract(5, "days");
  const endDate = bookingEndDate.clone().add(5, "days");

  // Calculate the total range in days
  const totalDays = endDate.diff(startDate, "days");

  // Convert date to numeric value
  const dateToValue = (date: any) => date.diff(startDate, "days");

  // Convert numeric value back to date
  const valueToDate = (value: any) => startDate.clone().add(value, "days");

  // Initial slider values (start and end of the range based on booking dates)
  const [range, setRange] = useState([
    dateToValue(bookingStartDate),
    dateToValue(bookingEndDate),
  ]);

  // Handler to update slider range
  const handleSliderChange = (newRange: any) => {
    setRange(newRange);
  };
  const { toast } = useToast();
  // Generate marks for each day
  const generateMarks = () => {
    const marks: any = {};
    for (let i = 0; i <= totalDays; i++) {
      const date = valueToDate(i).format("DD-MM");
      marks[i] = date;
    }
    return marks;
  };

  const marks = generateMarks();

  // Convert slider values to date strings
  const startDateDisplay = valueToDate(range[0]).format("DD-MM-YYYY");
  const endDateDisplay = valueToDate(range[1]).format("DD-MM-YYYY");

  useEffect(() => {
    // Update the initial range if the initial dates change
    const newBookingStartDate = moment(initialStartDate);
    const newBookingEndDate = moment(initialEndDate);
    setRange([
      dateToValue(newBookingStartDate),
      dateToValue(newBookingEndDate),
    ]);
  }, [initialStartDate, initialEndDate]);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const amount = calculateTotalPrice({
      fromDate: valueToDate(range[0]).toDate(),
      toDate: valueToDate(range[1]).toDate(),
      dailyPrice: bookingFee,
    });
    setAmount(amount + taxiArrivalFee + taxiDepartureFee);
  }, [range[0], range[1], bookingFee, taxiArrivalFee, taxiDepartureFee]);

  // Preserve time when updating dates
  // eslint-disable-next-line no-unused-vars
  const preserveTime = (
    targetDate: moment.Moment,
    sourceDate: moment.Moment
  ) => {
    return targetDate
      .year(sourceDate.year())
      .month(sourceDate.month())
      .date(sourceDate.date());
  };
  const handleUpdate = async () => {
    try {
      const res = await updateBookingDates({
        path: pathname,
        bookingId: id,
        fromDate: valueToDate(range[0]).toDate(),
        toDate: valueToDate(range[1]).toDate(),
        price: totalAmount,
      });
      const booking = JSON.parse(res);
      if (booking) {
        toast({
          className: cn(
            "bg-celtic-green border-none text-white   text-center flex flex-center max-w-[300px] bottom-0 left-0 fixed  "
          ),
          title: "Επιτυχία",
          description: "Η κράτηση ενημερώθηκε",
        });
      }
    } catch (error) {
      toast({
        className: cn(
          "bg-red-dark border-none text-white   text-center flex flex-center max-w-[300px] bottom-0 left-0 fixed  "
        ),
        title: "Αποτυχία ενημέρωσης",
        description: `${error}`,
      });
    } finally {
      window.location.reload();
    }
  };
  return (
    <div className="mt-4 flex h-full max-h-[20vh] w-full flex-col justify-between rounded-lg bg-neutral-100 p-[1rem] text-dark-100 dark:bg-dark-100 dark:text-light-800">
      <div className="mb-4 flex w-full flex-row items-center justify-between">
        {" "}
        <h3 className=" text-lg font-normal text-dark-100 dark:text-green-300">
          {" "}
          Αλλαγή Ημερομηνιών
        </h3>
        <span className="rounded-full bg-light-800 px-1 py-2 font-semibold  dark:bg-dark-100">
          {totalAmount} €
        </span>
      </div>
      <div className="mb-2 h-full px-4">
        <Slider
          styles={{
            track: { backgroundColor: "#86efac" },
            handle: { backgroundColor: "#ffffff", borderColor: "#7c43bd" },
            rail: { backgroundColor: "#121212 " },
          }}
          dotStyle={{
            backgroundColor: "#121212",
            borderColor: "#dce3f1",
          }}
          activeDotStyle={{ backgroundColor: "#7c43bd" }}
          range
          min={0}
          max={totalDays}
          value={range}
          step={1} // Step set to 1 day
          onChange={handleSliderChange}
          marks={marks}
          allowCross={false} // Prevents the sliders from crossing over each other
          pushable={1}
        />
      </div>
      <div className="text-md mt-6 flex w-full  font-medium">
        <div className="flex flex-col">
          <p>Αρχή Κράτησης: {startDateDisplay}</p>
          <p>Τέλος Κράτησης: {endDateDisplay}</p>
        </div>
        <div className=" ml-auto mr-4 mt-4 flex flex-row items-center gap-2 ">
          <button
            onClick={handleUpdate}
            className="rounded-full bg-[#1ED760] px-3 py-1 font-bold tracking-widest text-white  transition-colors duration-200 hover:scale-105 hover:bg-[#21e065]"
          >
            Ενημέρωση
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChangeDates;
