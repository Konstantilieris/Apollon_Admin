"use client";
import React from "react";
import {
  TableHeader,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@/components/ui/table";
import { IconRefresh } from "@tabler/icons-react";
import { reversePayment } from "@/lib/actions/service.action";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";

const PaymentTab = ({ payments }: { payments: any[] }) => {
  const { toast } = useToast();
  const handleReversePayment = async ({ payment }: any) => {
    if (payment.reversed || !payment) return;
    try {
      const res = await reversePayment({ paymentId: payment._id });
      if (res.success) {
        toast({
          title: "Επιτυχία",
          description: "Η αντιστροφή ολοκληρώθηκε.",
          className: cn(
            "bg-celtic-green border-none text-white   text-center flex flex-center max-w-[300px] bottom-0 left-0 fixed font-sans "
          ),
        });
      }
    } catch (error) {
      console.error("Error reversing payment:", error);
      toast({
        title: "Error",
        className: cn(
          "bg-red-500 border-none text-white   text-center flex flex-center max-w-[300px] bottom-0 left-0 fixed font-sans "
        ),
        description: "Η αντιστροφή απέτυχε.",
      });
    } finally {
      window.location.reload();
    }
  };
  return (
    <div className="ml-8 min-h-[70vh] overflow-x-auto">
      <Table className="min-w-full rounded-xl border border-none border-gray-200 shadow-md">
        <TableHeader>
          <TableRow className="bg-dark-400 text-left">
            <TableHead className="px-4 py-3 font-semibold text-light-900">
              Πελάτης
            </TableHead>
            <TableHead className="px-4 py-3 font-semibold text-light-900">
              Ποσό
            </TableHead>
            <TableHead className="px-4 py-3 font-semibold text-light-900">
              Ημερομηνία
            </TableHead>
            <TableHead className="px-4 py-3 font-semibold text-light-900">
              Υπηρεσία
            </TableHead>
            <TableHead className="px-4 py-3 font-semibold text-light-900">
              Κατανομές
            </TableHead>
            <TableHead className="px-4 py-3 font-semibold text-light-900">
              Σημειώσεις
            </TableHead>
            <TableHead className="px-4 py-3 font-semibold text-light-900">
              Αντιστροφή
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {payments.map((payment: any) => (
            <TableRow
              key={payment._id}
              className={cn(
                "bg-dark-300 text-light-900",
                payment.reversed && "line-through"
              )}
            >
              {/* Client Name */}
              <TableCell className="px-4 py-3">
                {payment.clientId?.name || "Unknown"}
              </TableCell>

              {/* Amount */}
              <TableCell className="px-4 py-3">{payment.amount}€</TableCell>

              {/* Date */}
              <TableCell className="px-4 py-3">
                {new Date(payment.date).toLocaleDateString()}
              </TableCell>

              {/* Service Type */}
              <TableCell className="px-4 py-3">
                {payment.serviceId?.serviceType || "N/A"}
              </TableCell>

              {/* Allocations */}
              <TableCell className="px-4 py-3">
                {payment.allocations && payment.allocations.length > 0 ? (
                  <ul>
                    {payment.allocations.map(
                      (allocation: any, index: number) => (
                        <li
                          key={index + allocation.amount + allocation.serviceId}
                        >
                          {allocation.serviceId?.serviceType || "Unknown"}:{" "}
                          {allocation.amount}€
                        </li>
                      )
                    )}
                  </ul>
                ) : (
                  "N/A"
                )}
              </TableCell>

              {/* Notes */}
              <TableCell className="px-4 py-3">
                {payment.notes || "No notes"}
              </TableCell>

              {/* Reversed */}
              <TableCell className="py-3 pl-8">
                <IconRefresh
                  className={cn("h-6 w-6 text-light-900 hover:scale-110", {
                    "text-gray-400": payment.reversed,
                  })}
                  onClick={() => handleReversePayment({ payment })}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default PaymentTab;
