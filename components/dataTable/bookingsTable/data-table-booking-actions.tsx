"use client";

import { DotsHorizontalIcon } from "@radix-ui/react-icons";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import Link from "next/link";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { deleteRoomById, updateRoomById } from "@/lib/actions/room.action";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { usePathname } from "next/navigation";
export function DataTableBookingRowActions({ row }: any) {
  const [show, setsShow] = useState(false);
  const [deleteMode, setDeleteMode] = useState(false);
  const [name, setName] = useState("");
  const path = usePathname();
  const { toast } = useToast();
  const handleEditRoom = async () => {
    setsShow(!show);
    if (deleteMode) {
      try {
        const deletedRoom = await deleteRoomById(row.original._id, path);
        if (deletedRoom) {
          toast({
            className: cn(
              "bg-celtic-green border-none text-white  font-sans text-center flex flex-center max-w-[300px] bottom-0 left-0 fixed  "
            ),
            title: "Επιτυχία",
            description: `Επιτυχής διαγραφή δωματίου ${deletedRoom.name}`,
          });
        }
      } catch (error) {
        console.error("Error deleting room", error);
        toast({
          className: cn(
            "bg-red-dark border-none text-white  font-sans text-center flex flex-center max-w-[300px] bottom-0 left-0 fixed  "
          ),
          title: "Αποτυχία",
          description: "Αποτυχία διαγραφής δωματίου",
        });
      } finally {
        window.location.reload();
      }
    } else {
      try {
        const updatedRoom = await updateRoomById(row.original._id, name, path);
        if (updatedRoom) {
          toast({
            className: cn(
              "bg-celtic-green border-none text-white  font-sans text-center flex flex-center max-w-[300px] bottom-0 left-0 fixed  "
            ),
            title: "Επιτυχία",
            description: `Επιτυχής αλλαγή δωματίου ${updatedRoom.name}`,
          });
        }
      } catch (error) {
        console.error("Error updating room", error);
        toast({
          className: cn(
            "bg-red-dark border-none text-white  font-sans text-center flex flex-center max-w-[300px] bottom-0 left-0 fixed  "
          ),
          title: "Αποτυχία",
          description: "Αποτυχία αλλαγής δωματίου",
        });
      } finally {
        window.location.reload();
      }
    }
  };
  return (
    <>
      <AlertDialog open={show} onOpenChange={setsShow}>
        <AlertDialogTrigger asChild></AlertDialogTrigger>
        <AlertDialogContent className=" background-light800_dark400 text-dark200_light800 flex flex-col gap-4 p-8">
          <AlertDialogHeader>
            <AlertDialogTitle>
              Πραγματοποιείται {deleteMode ? "διαγραφή" : "αλλαγή"} στο δωμάτιο{" "}
              {row.original.name}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {!deleteMode ? (
                <span className="flex flex-row items-center gap-2">
                  Επιλέξτε το νέο όνομα του δωματίου :{" "}
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="background-light900_dark300 text-dark200_light800  h-8 w-24 max-w-[200px]  p-0 font-sans font-bold"
                  />
                </span>
              ) : (
                ""
              )}
              Είστε σίγουροι για την ενέργεια που θέλετε να πραγματοποιήσετε;
              <br />
              {!deleteMode ? `Νέο Ονομα Δωματίου : ${name}` : ""}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Ακύρωση</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                handleEditRoom();
              }}
              className="border-2 border-blue-500 hover:scale-105"
            >
              Συνέχεια
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="data-[state=open]:bg-muted flex h-8 w-8 p-0"
          >
            <DotsHorizontalIcon className="h-4 w-4" />
            <span className="sr-only">Ανοιξε menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="center"
          className="background-light900_dark300 text-dark200_light800 w-[160px] font-sans font-bold"
        >
          <DropdownMenuSeparator />
          <DropdownMenuSub></DropdownMenuSub>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="hover:bg-sky-200 hover:dark:bg-deep-purple">
            <span
              className="text-center"
              onClick={() => {
                setsShow(!show);
                setDeleteMode(false);
              }}
            >
              Μετονομασία Δωματίου
            </span>
          </DropdownMenuItem>
          <DropdownMenuItem className="hover:bg-sky-200 hover:dark:bg-deep-purple">
            <span
              className="text-center"
              onClick={() => {
                setsShow(!show);
                setDeleteMode(!deleteMode);
              }}
            >
              Διαγραφή Δωματίου
            </span>
          </DropdownMenuItem>
          {row.original.currentBookings.length > 0 ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="data-[state=open]:bg-muted flex  p-0 font-sans font-bold hover:bg-sky-300 hover:dark:bg-deep-purple"
                >
                  <span>Επεργασία Κρατήσεων</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="center"
                className="background-light900_dark300 text-dark200_light800 w-[180px] font-sans font-bold"
              >
                {row.original.currentBookings.map((booking: any) => {
                  return (
                    <DropdownMenuItem
                      key={booking._id}
                      className="hover:bg-sky-200 hover:dark:bg-deep-purple"
                    >
                      <Link href={`/booking/${booking._id}`}>
                        <span className="flex ">
                          {booking.dogs.map((dog: any) => dog.dogName)}
                          <h1>-{booking.clientId.lastName}</h1>
                        </span>{" "}
                      </Link>
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <span className="flex text-end font-sans font-bold"></span>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
