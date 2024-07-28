"use client";
import React, { useState, useEffect, useRef } from "react";
import "rc-slider/assets/index.css";
import Slider from "rc-slider";
import moment from "moment"; // For date manipulation
import "./slider.module.css";
import { calculateTotalPrice } from "@/lib/utils";
import { Button } from "../ui/button";

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

  return (
    <div className="mt-4 flex h-full w-full flex-col justify-between p-[1rem] text-light-700 dark:bg-dark-100">
      <h3 className="mb-8 text-[0.9vw] text-green-300"> Αλλαγή Ημερομηνιών</h3>
      <div className="mb-2 px-4">
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
      <div className="mt-6 flex w-full font-sans text-[0.9vw] font-medium">
        <div className="flex flex-col">
          <p>Αρχή Κράτησης: {startDateDisplay}</p>
          <p>Τέλος Κράτησης: {endDateDisplay}</p>
        </div>
        <div className=" ml-auto mr-4 mt-4 flex flex-row items-center gap-2 ">
          <span className="text-lg">{totalAmount} € </span>
          <Button className="rounded-full bg-green-300 p-2 font-sans text-lg text-dark-100 hover:scale-105">
            {" "}
            Αλλαγή
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChangeDates;
