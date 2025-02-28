"use client";
import React from "react";
import { useToast } from "../ui/use-toast";
import { cn } from "@/lib/utils";
import { deleteBooking } from "@/lib/actions/booking.action";
import { usePathname, useRouter } from "next/navigation";
interface DeleteParams {
  bookingId: string;
  clientId: string;
}
const DeleteBooking = ({ bookingId, clientId }: DeleteParams) => {
  const { toast } = useToast();
  const path = usePathname();
  const router = useRouter();
  const handleDelete = async () => {
    console.log("delete booking");
    try {
      const res = await deleteBooking({ id: bookingId, clientId, path });

      if (res.message === "success") {
        toast({
          className: cn(
            "bg-celtic-green border-none text-white  text-center flex flex-center max-w-[300px] bottom-0 left-0 fixed  "
          ),
          title: "Επιτυχία",
          description: "Η κράτηση διαγράφηκε",
        });
      }
    } catch (err) {
      toast({
        className: cn(
          "bg-celtic-green border-none text-white  text-center flex flex-center max-w-[300px] bottom-0 left-0 fixed  "
        ),
        title: "Σφάλμα",
        description: "Η κράτηση δεν διαγράφηκε",
      });
    } finally {
      router.push("/booking");
    }
  };
  return (
    <button
      className="mr-10 mt-12 rounded-full bg-red-600 px-4 py-2 font-bold tracking-widest text-white transition-colors duration-200 hover:animate-pulse hover:bg-red-700"
      onClick={handleDelete}
    >
      Διαγραφή
    </button>
  );
};

export default DeleteBooking;
