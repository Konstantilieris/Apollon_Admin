"use client";
import React from "react";
import { toast } from "sonner";

import { deleteBooking } from "@/lib/actions/booking.action";
import { usePathname, useRouter } from "next/navigation";
interface DeleteParams {
  bookingId: string;
  clientId: string;
}
const DeleteBooking = ({ bookingId, clientId }: DeleteParams) => {
  const path = usePathname();
  const router = useRouter();
  const handleDelete = async () => {
    console.log("delete booking");
    try {
      const res = await deleteBooking({ id: bookingId, clientId, path });

      if (res.message === "success") {
        toast.success("Η κράτηση διαγράφηκε επιτυχώς");
      }
    } catch (err) {
      toast.error("Η κράτηση δεν διαγράφηκε επιτυχώς");
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
