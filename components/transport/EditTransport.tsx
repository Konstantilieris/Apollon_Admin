"use client";
import React, { useState } from "react";
import { toast } from "sonner";
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
import { DatePicker } from "../datepicker/DatePicker";
import { TimePicker } from "../shared/timepicker/TimePicker";
import { cn, formatDate, formatDateUndefined, formatTime } from "@/lib/utils";
import {
  editTransportArrival,
  editTransportDate,
} from "@/lib/actions/transportation.action";
const EditTransport = ({ transport }: any) => {
  const [edit, setEdit] = useState(false);
  const [timeArrival, setTimeArrival] = useState<Date>();

  const [editTimeArrival, setEditTimeArrival] = useState(false);

  const [modeDelete, setModeDelete] = useState(false);
  const [editDate, setEditDate] = useState(false);
  const [date, setDate] = useState<Date>(transport.date);
  const [submitEditDate, setSubmitEditDate] = useState(false);
  const [submitArrival, setSubmitArrival] = useState(false);
  const submitArrivalChange = async () => {
    try {
      const updatedTransport = await editTransportArrival(
        transport._id,
        timeArrival
      );
      if (updatedTransport) {
        toast.success(
          `Η ώρα άφιξης για την μεταφορά του ${transport.clientId.lastName} τροποποιήθηκε`
        );
      }
    } catch (error) {
      toast.error(`Η τροποποίηση της ώρας άφιξης απέτυχε. ${error}`);
    } finally {
      window.location.reload();
      setSubmitArrival(false);
      setEditTimeArrival(false);
      setEdit(false);
    }
  };
  if (submitArrival) {
    return (
      <AlertDialog open={submitArrival} onOpenChange={setSubmitArrival}>
        <AlertDialogTrigger></AlertDialogTrigger>
        <AlertDialogContent className="background-light900_dark300 text-dark200_light900 min-h-[300px] min-w-[600px]">
          <AlertDialogHeader>
            <AlertDialogTitle className=" text-[24px]">
              Η ώρα άφιξης για την μεταφορά του {transport.clientId.lastName} θα
              τροποποιηθεί.
            </AlertDialogTitle>
            <AlertDialogDescription className=" text-[20px] font-semibold">
              Στοιχέια Κρατησης
              <br /> &bull; ID : {transport._id} <br />
              &bull; Αρχική ώρα άφιξης : {transport.timeArrival}
              <br />
              &bull; Τελική ώρα άφιξης : {formatTime(timeArrival, "el")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="btn border-2 border-red-dark  font-bold hover:scale-105 hover:animate-pulse">
              ΑΚΥΡΩΣΗ
            </AlertDialogCancel>
            <Button
              className="btn border-2 border-purple-300  font-bold hover:scale-105 hover:animate-pulse"
              onClick={submitArrivalChange}
            >
              ΣΥΝΕΧΕΙΑ
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }
  const submitDateChange = async () => {
    try {
      const updatedTransport = await editTransportDate(transport._id, date);
      if (updatedTransport) {
        toast({
          className: cn(
            "bg-celtic-green border-none text-white   text-center flex flex-center max-w-[300px] bottom-0 left-0 fixed  "
          ),
          title: "Επιτυχία",
          description: `το booking του πελάτη ${transport.clientId.lastName} τροποποιήθηκε`,
        });
      }
    } catch (error) {
      toast({
        className: cn(
          "bg-red-dark border-none text-white   text-center flex flex-center max-w-[300px] bottom-0 left-0 fixed  "
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
  if (submitEditDate) {
    return (
      <AlertDialog open={submitEditDate} onOpenChange={setSubmitEditDate}>
        <AlertDialogTrigger></AlertDialogTrigger>
        <AlertDialogContent className="background-light900_dark300 text-dark200_light900">
          <AlertDialogHeader>
            <AlertDialogTitle className=" text-[24px]">
              Πραγματοποιείται αλλαγή στην ημερομηνία της μεταφοράς του{" "}
              {transport.clientId.lastName}
            </AlertDialogTitle>
            <AlertDialogDescription className=" text-[20px] font-semibold">
              &bull; Αρχική ημερομηνία :{" "}
              {formatDate(new Date(transport.date), "el")}
              <br />
              &bull; Τελική ημερομηνία : {formatDateUndefined(date, "el")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="btn border-2 border-red-dark  font-bold hover:scale-105 hover:animate-pulse">
              ΑΚΥΡΩΣΗ
            </AlertDialogCancel>
            <Button
              className="btn border-2 border-purple-300  font-bold hover:scale-105 hover:animate-pulse"
              onClick={submitDateChange}
            >
              ΣΥΝΕΧΕΙΑ
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }
  if (modeDelete) {
    return (
      <AlertDialog open={modeDelete} onOpenChange={setModeDelete}>
        <AlertDialogTrigger></AlertDialogTrigger>
        <AlertDialogContent className="background-light900_dark300 text-dark200_light900">
          <AlertDialogHeader>
            <AlertDialogTitle>
              Πραγματοποιείται Διαγραφή στην κράτηση {transport._id}
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
            <AlertDialogAction className="btn border-2 border-red-500 hover:scale-105">
              Συνέχεια
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }
  if (!edit && !modeDelete)
    return (
      <div className="flex flex-row gap-2">
        <Button
          className="btn border-2 border-red-500  font-bold hover:scale-105 hover:animate-pulse"
          onClick={() => setModeDelete(true)}
        >
          ΔΙΑΓΡΑΦΗ
        </Button>
        <Button
          className="btn border-2 border-purple-500  font-bold hover:scale-105 hover:animate-pulse"
          onClick={() => setEdit(true)}
        >
          ΑΛΛΑΓΗ
        </Button>
      </div>
    );
  if (edit && !editTimeArrival && !editDate) {
    return (
      <div className="text-dark200_light900 background-light900_dark300 flex max-w-[600px] rounded-lg border-2  font-bold">
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
      <div className="flex flex-row items-end justify-start gap-4  text-lg font-bold ">
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
  if (editDate) {
    return (
      <div className="flex flex-row items-center justify-start gap-4  text-lg font-bold ">
        <span>ΑΛΛΑΓΗ ΣΤΗΝ ΗΜΕΡΟΜΗΝΙΑ</span>
        <DatePicker date={date} setDate={setDate} />
        <Button
          className="btn border-2 border-red-500 font-bold hover:scale-105 hover:animate-pulse "
          onClick={() => setEditDate(false)}
        >
          Cancel
        </Button>
        <Button
          className="btn border-2 border-yellow-500 font-bold hover:scale-105 hover:animate-pulse"
          onClick={() => setSubmitEditDate(true)}
          disabled={!date || date.toString() === transport.date.toString()}
        >
          Submit
        </Button>
      </div>
    );
  }
};
export default EditTransport;
