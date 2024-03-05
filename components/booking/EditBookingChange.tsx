"use client";
import React, { useState } from "react";
import { Button } from "../ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { TimePicker } from "../shared/timepicker/TimePicker";
import { DateRange } from "react-day-picker";
import { DatePickerWithRange } from "../datepicker/DateRangePicker";

import {
  cn,
  formatDate,
  formatDateUndefined,
  formatTime,
  options,
} from "@/lib/utils";

import {
  editBookingArrival,
  editBookingDate,
  editBookingDeparture,
} from "@/lib/actions/booking.action";
import { useToast } from "../ui/use-toast";

import dynamic from "next/dynamic";
const DynamicRoomChange = dynamic(() => import("./RoomChange"));

const EditbookingChange = ({ booking, rooms }: any) => {
  const [edit, setEdit] = useState(false);
  const [submitEditDate, setSubmitEditDate] = useState(false);
  const [submitArrival, setSubmitArrival] = useState(false);
  const [submitDeparture, setSubmitDeparture] = useState(false);
  const [modeDelete, setModeDelete] = useState(false);
  const [editTimeArrival, setEditTimeArrival] = useState(false);
  const [editTimeDeparture, setEditTimeDeparture] = useState(false);
  const [timeArrival, setTimeArrival] = useState<Date>();
  const inputDateFrom = new Date(booking.fromDate).toLocaleString(
    "en-US",
    options as Intl.DateTimeFormatOptions
  );
  const inputDateTo = new Date(booking.toDate).toLocaleString(
    "en-US",
    options as Intl.DateTimeFormatOptions
  );
  const [dateBooking, setDateBooking] = useState<DateRange>({
    from: new Date(inputDateFrom),
    to: new Date(inputDateTo),
  });
  const { toast } = useToast();
  const [timeDeparture, setTimeDeparture] = useState<Date>();
  const [editDate, setEditDate] = useState(false);
  const [editRoom, setEditRoom] = useState(false);

  if (!edit && !modeDelete)
    return (
      <div className="flex flex-row gap-2">
        <Button
          className="btn border-2 border-red-500 font-noto_sans font-bold hover:scale-105 hover:animate-pulse"
          onClick={() => setModeDelete(true)}
        >
          ΔΙΑΓΡΑΦΗ
        </Button>
        <Button
          className="btn border-2 border-purple-500 font-noto_sans font-bold hover:scale-105 hover:animate-pulse"
          onClick={() => setEdit(true)}
        >
          ΑΛΛΑΓΗ
        </Button>
      </div>
    );

  const submitDateChange = async () => {
    try {
      const updatedBooking = await editBookingDate(booking._id, dateBooking);
      if (updatedBooking) {
        toast({
          className: cn(
            "bg-celtic-green border-none text-white  font-noto_sans text-center flex flex-center max-w-[300px] bottom-0 left-0 fixed  "
          ),
          title: "Επιτυχία",
          description: `το booking του πελάτη ${booking.clientId.lastName} τροποποιήθηκε`,
        });
      }
    } catch (error) {
      toast({
        className: cn(
          "bg-red-dark border-none text-white  font-noto_sans text-center flex flex-center max-w-[300px] bottom-0 left-0 fixed  "
        ),
        title: "Αποτυχία τροποποιήσης",
        description: `${error}`,
      });
    } finally {
      window.location.reload();
      setSubmitEditDate(false);
      setEditDate(false);
      setEdit(false);
    }
  };
  const submitArrivalChange = async () => {
    try {
      const updatedBooking = await editBookingArrival(booking._id, timeArrival);
      if (updatedBooking) {
        toast({
          className: cn(
            "bg-celtic-green border-none text-white  font-noto_sans text-center flex flex-center max-w-[300px] bottom-0 left-0 fixed  "
          ),
          title: "Επιτυχία",
          description: `το booking του πελάτη ${booking.clientId.lastName} τροποποιήθηκε`,
        });
      }
    } catch (error) {
      toast({
        className: cn(
          "bg-red-dark border-none text-white  font-noto_sans text-center flex flex-center max-w-[300px] bottom-0 left-0 fixed  "
        ),
        title: "Αποτυχία τροποποιήσης",
        description: `${error}`,
      });
    } finally {
      window.location.reload();
      setSubmitArrival(false);
      setEditTimeArrival(false);
      setEdit(false);
    }
  };
  const submitDepartureChange = async () => {
    try {
      const updatedBooking = await editBookingDeparture(
        booking._id,
        timeDeparture
      );
      if (updatedBooking) {
        toast({
          className: cn(
            "bg-celtic-green border-none text-white  font-noto_sans text-center flex flex-center max-w-[300px] bottom-0 left-0 fixed  "
          ),
          title: "Επιτυχία",
          description: `το booking του πελάτη ${booking.clientId.lastName} τροποποιήθηκε`,
        });
      }
    } catch (error) {
      toast({
        className: cn(
          "bg-red-dark border-none text-white  font-noto_sans text-center flex flex-center max-w-[300px] bottom-0 left-0 fixed  "
        ),
        title: "Αποτυχία τροποποιήσης",
        description: `${error}`,
      });
    } finally {
      window.location.reload();
      setSubmitDeparture(false);
      setEditTimeDeparture(false);
      setEdit(false);
    }
  };
  if (modeDelete) {
    return (
      <AlertDialog open={modeDelete} onOpenChange={setModeDelete}>
        <AlertDialogTrigger></AlertDialogTrigger>
        <AlertDialogContent className="background-light900_dark300 text-dark200_light900">
          <AlertDialogHeader>
            <AlertDialogTitle>
              Πραγματοποιείται Διαγραφή στην κράτηση {booking._id}
            </AlertDialogTitle>
            <AlertDialogDescription>
              Αυτή η ενέργεια δεν μπορεί να αναιρεθεί. Αυτό θα διαγράψει μόνιμα
              την κρατηση σας και θα αφαιρέσει τα δεδομένα σας από τους
              διακομιστές μας.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="hover:scale-105">
              Ακύρωση
            </AlertDialogCancel>
            <AlertDialogAction className="btn hover:scale-105">
              Συνέχεια
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }
  if (submitEditDate) {
    return (
      <AlertDialog open={submitEditDate} onOpenChange={setSubmitEditDate}>
        <AlertDialogTrigger></AlertDialogTrigger>
        <AlertDialogContent className="background-light900_dark300 text-dark200_light900">
          <AlertDialogHeader>
            <AlertDialogTitle className=" text-[24px]">
              Πραγματοποιείται αλλαγή στην ημερομηνία της κράτησης του{" "}
              {booking.clientId.lastName}
            </AlertDialogTitle>
            <AlertDialogDescription className="font-noto_sans text-[20px] font-semibold">
              &bull; Αρχική κράτηση απο{" "}
              {formatDate(new Date(booking.fromDate), "el")}
              {" μεχρι "}
              {formatDate(new Date(booking.toDate), "el")}
              <br />
              &bull; Τελική Κράτηση απο{" "}
              {formatDateUndefined(dateBooking?.from, "el")} μεχρι{" "}
              {formatDateUndefined(dateBooking?.to, "el")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="btn border-2 border-red-dark font-noto_sans font-bold hover:scale-105 hover:animate-pulse">
              ΑΚΥΡΩΣΗ
            </AlertDialogCancel>
            <Button
              className="btn border-2 border-purple-300 font-noto_sans font-bold hover:scale-105 hover:animate-pulse"
              onClick={submitDateChange}
            >
              ΣΥΝΕΧΕΙΑ
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }
  if (submitArrival) {
    return (
      <AlertDialog open={submitArrival} onOpenChange={setSubmitArrival}>
        <AlertDialogTrigger></AlertDialogTrigger>
        <AlertDialogContent className="background-light900_dark300 text-dark200_light900 min-h-[300px] min-w-[600px]">
          <AlertDialogHeader>
            <AlertDialogTitle className=" text-[24px]">
              Η ώρα άφιξης για την κράτησή του {booking.clientId.lastName} θα
              τροποποιηθεί.
            </AlertDialogTitle>
            <AlertDialogDescription className="font-noto_sans text-[20px] font-semibold">
              Στοιχέια Κρατησης
              <br /> &bull; ID : {booking._id} <br />
              &bull; Αρχική ώρα άφιξης : {booking.timeArrival}
              <br />
              &bull; Τελική ώρα άφιξης : {formatTime(timeArrival, "el")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="btn border-2 border-red-dark font-noto_sans font-bold hover:scale-105 hover:animate-pulse">
              ΑΚΥΡΩΣΗ
            </AlertDialogCancel>
            <Button
              className="btn border-2 border-purple-300 font-noto_sans font-bold hover:scale-105 hover:animate-pulse"
              onClick={submitArrivalChange}
            >
              ΣΥΝΕΧΕΙΑ
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }
  if (submitDeparture) {
    return (
      <AlertDialog open={submitDeparture} onOpenChange={setSubmitDeparture}>
        <AlertDialogTrigger></AlertDialogTrigger>
        <AlertDialogContent className="background-light900_dark300 text-dark200_light900 min-h-[300px] min-w-[600px]">
          <AlertDialogHeader>
            <AlertDialogTitle className=" text-[24px]">
              Η ώρα άφιξης για την κράτησή του {booking.clientId.lastName} θα
              τροποποιηθεί.
            </AlertDialogTitle>
            <AlertDialogDescription className="font-noto_sans text-[20px] font-semibold">
              Στοιχέια Κρατησης
              <br /> &bull; ID : {booking._id} <br />
              &bull; Αρχική ώρα άφιξης : {booking.timeDeparture}
              <br />
              &bull; Τελική ώρα άφιξης : {formatTime(timeDeparture, "el")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="btn border-2 border-red-dark font-noto_sans font-bold hover:scale-105 hover:animate-pulse">
              ΑΚΥΡΩΣΗ
            </AlertDialogCancel>
            <Button
              className="btn border-2 border-purple-300 font-noto_sans font-bold hover:scale-105 hover:animate-pulse"
              onClick={submitDepartureChange}
            >
              ΣΥΝΕΧΕΙΑ
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }
  if (
    edit &&
    !editTimeArrival &&
    !editTimeDeparture &&
    !editDate &&
    !editRoom
  ) {
    return (
      <div className="text-dark200_light900 background-light900_dark300 flex max-w-[600px] rounded-lg border-2 font-noto_sans font-bold">
        <Command>
          <CommandInput placeholder="Διάλεξε Ενέργεια" />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="ΕΝΕΡΓΕΙΕΣ">
              <CommandItem
                className="text-center hover:bg-purple-400"
                onSelect={() => setEditDate(true)}
              >
                ΑΛΛΑΓΗ ΗΜΕΡΟΜΗΝΙΑΣ
              </CommandItem>
              <CommandItem
                className="hover:bg-purple-400"
                onSelect={() => setEditTimeArrival(true)}
              >
                ΑΛΛΑΓΗ ΩΡΑΣ ΑΦΙΞΗΣ
              </CommandItem>
              <CommandItem
                className="hover:bg-purple-400"
                onSelect={() => setEditTimeDeparture(true)}
              >
                ΑΛΛΑΓΗ ΩΡΑΣ ΑΝΑΧΩΡΗΣΗΣ
              </CommandItem>
              <CommandItem
                className="hover:bg-purple-400"
                onSelect={() => setEditRoom(true)}
              >
                ΑΛΛΑΓΗ ΔΩΜΑΤΙΟΥ
              </CommandItem>
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="ΡΥθΜΙΣΕΙΣ">
              <CommandItem
                className="hover:bg-red-dark"
                onSelect={() => setEdit(false)}
              >
                ΑΚΥΡΩΣΗ
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </div>
    );
  }
  if (editTimeArrival) {
    return (
      <div className="flex flex-row items-end justify-start gap-4 font-noto_sans text-lg font-bold ">
        <span>ΑΛΛΑΓΗ ΣΤΗΝ ΩΡΑ ΑΦΙΞΗΣ </span>
        <TimePicker date={timeArrival} setDate={setTimeArrival} />{" "}
        <Button
          className="btn hover:scale-105 hover:animate-pulse"
          onClick={() => {
            setEditTimeArrival(false);
            setEdit(false);
          }}
        >
          Cancel
        </Button>
        <Button
          className="btn hover:scale-105 hover:animate-pulse "
          onClick={() => setSubmitArrival(true)}
        >
          Submit
        </Button>
      </div>
    );
  }
  if (editTimeDeparture) {
    return (
      <div className="flex flex-row items-end justify-start gap-4 font-noto_sans text-lg font-bold ">
        <span>ΑΛΛΑΓΗ ΣΤΗΝ ΩΡΑ ΑΝΑΧΩΡΗΣΗΣ</span>

        <TimePicker date={timeDeparture} setDate={setTimeDeparture} />
        <Button
          className="btn hover:scale-105 hover:animate-pulse"
          onClick={() => {
            setEditTimeDeparture(false);
            setEdit(false);
          }}
        >
          Cancel
        </Button>
        <Button
          className="btn hover:scale-105 hover:animate-pulse"
          onClick={() => setSubmitDeparture(true)}
        >
          Submit
        </Button>
      </div>
    );
  }
  if (editDate) {
    return (
      <div className="flex flex-row items-center justify-start gap-4 font-noto_sans text-lg font-bold ">
        <span>ΑΛΛΑΓΗ ΣΤΙΣ ΗΜΕΡΟΜΗΝΙΕΣ</span>
        <DatePickerWithRange
          rangeDate={dateBooking}
          setRangeDate={setDateBooking}
        />
        <Button
          className="btn border-2 border-red-500 font-bold hover:scale-105 hover:animate-pulse "
          onClick={() => setEditDate(false)}
        >
          Cancel
        </Button>
        <Button
          className="btn border-2 border-purple-500 font-bold hover:scale-105 hover:animate-pulse"
          onClick={() => setSubmitEditDate(true)}
          disabled={
            !dateBooking ||
            dateBooking.from === undefined ||
            dateBooking.to === undefined
          }
        >
          Submit
        </Button>
      </div>
    );
  }
  if (editRoom) {
    return (
      <div className=" flex flex-col items-center justify-center gap-4 font-noto_sans text-lg font-bold ">
        <div className="mt-8 flex flex-row items-center gap-8 self-start">
          <span className="self-start">ΑΛΛΑΓΗ ΣΤΑ ΔΩΜΑΤΙΑ ΤΩΝ ΣΚΥΛΩΝ</span>
          <Button
            className="btn self-start border-2 border-red-500 font-noto_sans font-bold hover:scale-105 hover:animate-pulse"
            onClick={() => setEditRoom(false)}
          >
            ΑΚΥΡΩΣΗ
          </Button>
        </div>
        <DynamicRoomChange
          booking={booking}
          rooms={rooms}
          setEditRoom={setEditRoom}
        />
      </div>
    );
  }
};

export default EditbookingChange;
