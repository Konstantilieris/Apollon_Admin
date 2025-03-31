"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Button, Checkbox, DateRangePicker } from "@heroui/react";
import { parseDate } from "@internationalized/date";
import { I18nProvider } from "@react-aria/i18n";

import useEditBookingStore from "@/hooks/editBooking-store";
import type { RangeValue } from "@react-types/shared";
import type { DateValue } from "@react-types/datepicker";

import CalendarTimeSelect from "@/components/shared/timepicker/timeSelect/calendar-time-select";
import { DurationEnum } from "@/components/shared/timepicker/timeSelect/calendar";
import BookingDetails from "./BookingDetails";
import { checkRoomAvailability } from "@/lib/actions/booking.action";

import { useToast } from "@/components/ui/use-toast";

// Helper function to combine date + "HH:mm" into JS Date
function combineDateTime(baseDate: Date, hhmm: string): Date {
  if (!baseDate || !hhmm) return baseDate;
  const [hours, minutes] = hhmm.split(":").map(Number);
  const newDate = new Date(baseDate);
  newDate.setHours(hours, minutes, 0, 0);
  return newDate;
}
// Helper function to extract "HH:mm" from Date
function extractHHMM(date: Date | undefined): string {
  if (!date) return "12:00";
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
}

export default function BookingFirstStage({
  handleNextOverlap,
}: {
  handleNextOverlap: any;
}) {
  const {
    dateArrival,
    setDateArrival,
    dateDeparture,
    setDateDeparture,
    taxiArrival,
    taxiDeparture,
    setTaxiArrival,
    setTaxiDeparture,
    extraDay,
    setExtraDay,
    booking,
  } = useEditBookingStore();
  const { toast } = useToast();

  const [timeArrival, setTimeArrival] = useState("12:00");
  const [timeDeparture, setTimeDeparture] = useState("12:00");
  useEffect(() => {
    setTimeArrival(extractHHMM(dateArrival));
  }, [dateArrival]);

  useEffect(() => {
    setTimeDeparture(extractHHMM(dateDeparture));
  }, [dateDeparture]);

  const rangeValue = useMemo<RangeValue<DateValue> | undefined>(() => {
    if (!dateArrival || !dateDeparture) return undefined;
    return {
      start: parseDate(
        dateArrival.getFullYear() +
          "-" +
          (dateArrival.getMonth() + 1).toString().padStart(2, "0") +
          "-" +
          dateArrival.getDate().toString().padStart(2, "0")
      ),
      end: parseDate(dateDeparture.toISOString().split("T")[0]),
    };
  }, [dateArrival, dateDeparture]);

  const handleDateRangeChange = (range: RangeValue<DateValue> | null) => {
    if (!range) return;
    if (range.start) {
      const newArrivalDate = new Date(
        range.start.year,
        range.start.month - 1,
        range.start.day,
        dateArrival?.getHours() || 12,
        dateArrival?.getMinutes() || 0
      );
      setDateArrival(newArrivalDate);
    } else {
      setDateArrival(undefined);
    }

    if (range.end) {
      const newDeparture = combineDateTime(
        range.end.toDate("UTC"),
        timeDeparture
      );
      setDateDeparture(newDeparture);
    } else {
      setDateDeparture(undefined);
    }
  };

  const arrivalWeekday = dateArrival
    ? dateArrival.toLocaleDateString("el-GR", { weekday: "short" })
    : "Δευ";
  const arrivalDay = dateArrival ? dateArrival.getDate() : 1;

  const departureWeekday = dateDeparture
    ? dateDeparture.toLocaleDateString("el-GR", { weekday: "short" })
    : "Τρι";
  const departureDay = dateDeparture ? dateDeparture.getDate() : 1;

  const handleArrivalConfirm = () => {
    if (dateArrival) {
      setDateArrival(combineDateTime(dateArrival, timeArrival));
    }
  };

  const handleDepartureConfirm = () => {
    if (dateDeparture) {
      setDateDeparture(combineDateTime(dateDeparture, timeDeparture));
    }
  };
  const handleNext = async () => {
    try {
      if (!booking || !dateArrival || !dateDeparture) return;

      const hasOverlap = await checkRoomAvailability({
        bookingId: booking._id,
        rangeDate: { from: dateArrival, to: dateDeparture },
      });
      handleNextOverlap(hasOverlap);
    } catch (error) {
      console.error(error);
      toast({
        title: "Σφάλμα",
        description: "Κάτι πήγε στραβά, παρακαλώ δοκιμάστε ξανά.",
        className: "bg-red-400 text-light-900",
      });
    }
  };
  return (
    <section className="flex h-full w-full flex-col items-center justify-center gap-12 p-8">
      <h1 className="text-2xl font-bold tracking-widest">
        Επεξεργασία Κράτησης
      </h1>

      <I18nProvider locale="el-GR">
        <div className="flex h-[50vh]   flex-row gap-12 self-center rounded-lg bg-neutral-950 p-2 ">
          <BookingDetails />

          {/* Date Range Picker with Greek localization */}
          <div className="flex flex-col gap-4 ">
            <DateRangePicker
              label="Διάρκεια Διαμονής"
              visibleMonths={2}
              showMonthAndYearPickers
              color="secondary"
              calendarWidth={400}
              value={rangeValue}
              onChange={handleDateRangeChange}
              className="w-[90vw] max-w-[450px]"
              size="lg"
              classNames={{
                calendar: "rounded-lg font-sans text-base",
                label: "font-sans text-base",
                input: "font-sans text-light-900",
                inputWrapper: "font-sans text-lg h-[100px]  ",
                calendarContent: "font-sans text-base",
                selectorButton: "font-sans  text-light-900",
                selectorIcon: "font-sans text-light-900",
                segment: "font-sans text-gray-400",
                base: "font-sans text-light-900",
                popoverContent: "font-sans text-light-900 text-base",
                separator: "font-sans text-light-900",
              }}
            />

            <div className="flex flex-col gap-2 ">
              <div className="flex flex-row gap-2">
                <div className="flex flex-col gap-2">
                  <CalendarTimeSelect
                    weekday={arrivalWeekday}
                    day={arrivalDay}
                    duration={DurationEnum.ThirtyMinutes}
                    selectedTime={timeArrival}
                    onTimeChange={setTimeArrival}
                    onConfirm={handleArrivalConfirm}
                  />

                  <Checkbox
                    isSelected={taxiArrival}
                    onValueChange={setTaxiArrival}
                    className="mt-2 "
                    classNames={{
                      icon: "text-lime-400",
                    }}
                    size="lg"
                  >
                    Pet Taxi (Άφιξη)
                  </Checkbox>
                </div>

                <div className="flex flex-col gap-2">
                  <CalendarTimeSelect
                    weekday={departureWeekday}
                    day={departureDay}
                    duration={DurationEnum.ThirtyMinutes}
                    selectedTime={timeDeparture}
                    onTimeChange={setTimeDeparture}
                    onConfirm={handleDepartureConfirm}
                  />
                  <Checkbox
                    isSelected={taxiDeparture}
                    onValueChange={setTaxiDeparture}
                    size="lg"
                    className="mt-2"
                    classNames={{
                      icon: "text-lime-400",
                    }}
                  >
                    Pet Taxi (Αναχώρηση)
                  </Checkbox>
                </div>
              </div>
              <Checkbox
                isSelected={extraDay}
                onValueChange={setExtraDay}
                size="lg"
                className="mt-2"
                classNames={{
                  icon: "text-purple-400",
                }}
              >
                Επιπλέον Ημέρα
              </Checkbox>
            </div>
          </div>
          <Button
            className="self-end text-base tracking-wide"
            variant="ghost"
            onPress={handleNext}
          >
            Επόμενο
          </Button>
        </div>
      </I18nProvider>
    </section>
  );
}
