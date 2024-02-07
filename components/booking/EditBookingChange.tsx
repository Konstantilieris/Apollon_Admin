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
import { ScrollArea } from "../ui/scroll-area";
import { cn } from "@/lib/utils";
import { Separator } from "@radix-ui/react-menubar";

const EditbookingChange = ({ booking, rooms }: any) => {
  const [edit, setEdit] = useState(false);
  const [modeDelete, setModeDelete] = useState(false);
  const [editTime, setEditTime] = useState(false);
  const [timeArrival, setTimeArrival] = useState<Date>();
  const [dateBooking, setDateBooking] = useState<DateRange>({
    from: booking.fromDate,
    to: booking.toDate,
  });
  const [timeDeparture, setTimeDeparture] = useState<Date>();
  const [editDate, setEditDate] = useState(false);
  const [editRoom, setEditRoom] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState();
  const handleDelete = () => {
    setModeDelete(true);
  };
  const handleEdit = () => {
    setEdit(true);
  };
  const cancelEdit = () => {
    setEdit(false);
  };
  const setTime = () => {
    setEditTime(true);
  };

  if (!edit && !modeDelete)
    return (
      <div className="flex flex-row gap-2">
        <Button className="btn" onClick={handleDelete}>
          Διαγραφή
        </Button>
        <Button className="btn" onClick={handleEdit}>
          Αλλαγή
        </Button>
      </div>
    );
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
  if (edit && !editTime && !editDate && !editRoom) {
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
              <CommandItem className="hover:bg-purple-400" onSelect={setTime}>
                ΑΛΛΑΓΗ ΩΡΑΣ
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
              <CommandItem className="hover:bg-red-dark" onSelect={cancelEdit}>
                ΑΚΥΡΩΣΗ
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </div>
    );
  }
  if (editTime) {
    return (
      <div className="flex flex-row items-end justify-center gap-4 font-noto_sans text-lg font-bold ">
        <span>ΑΛΛΑΓΗ στην ώρα άφιξης και αναχώρησης</span>
        <TimePicker date={timeArrival} setDate={setTimeArrival} />{" "}
        <TimePicker date={timeDeparture} setDate={setTimeDeparture} />
        <Button className="btn hover:scale-105 hover:animate-pulse">
          Cancel
        </Button>
        <Button className="btn hover:scale-105 hover:animate-pulse">
          Submit
        </Button>
      </div>
    );
  }
  if (editDate) {
    return (
      <div className="flex flex-row items-end justify-center gap-4 font-noto_sans text-lg font-bold ">
        <span>ΑΛΛΑΓΗ στην ημερομηνία άφιξης και αναχώρησης</span>
        <DatePickerWithRange
          rangeDate={dateBooking}
          setRangeDate={setDateBooking}
        />
        <Button className="btn hover:scale-105 hover:animate-pulse">
          Cancel
        </Button>
        <Button className="btn hover:scale-105 hover:animate-pulse">
          Submit
        </Button>
      </div>
    );
  }
  if (editRoom) {
    return (
      <div className=" flex flex-col items-center justify-center gap-4 font-noto_sans text-lg font-bold ">
        <span>ΑΛΛΑΓΗ στο δωμάτιο του Σκύλου</span>
        <ScrollArea className="custom-scrollbar background-light900_dark300 text-dark300_light700 h-72 w-[280px]  rounded-md border">
          <div className="p-4">
            {rooms.map((room: any) => (
              <div key={room._id}>
                <div
                  onClick={() => setSelectedRoom(room._id)}
                  className={cn(`text-dark300_light900 flex flex-col rounded-md px-4 py-1 font-noto_sans
                ${
                  selectedRoom === room._id
                    ? "bg-celtic-green text-white"
                    : "hover:bg-light-blue "
                }
              `)}
                >
                  <span className="font-bold"> ΔΩΜΑΤΙΟ {room.name}</span>
                </div>
                <Separator className="my-2" />
              </div>
            ))}
          </div>
        </ScrollArea>
        <Button className="btn max-w-[80px] self-center hover:scale-105 hover:animate-pulse">
          Cancel
        </Button>
        <Button className="btn max-w-[80px] self-center hover:scale-105 hover:animate-pulse">
          Submit
        </Button>
      </div>
    );
  }
};

export default EditbookingChange;
