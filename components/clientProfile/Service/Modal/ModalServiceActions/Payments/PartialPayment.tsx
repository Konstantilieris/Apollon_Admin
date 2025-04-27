"use client";
import React from "react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useServiceModal } from "@/hooks/use-service-modal";
import {
  partialPaymentSelected,
  syncOwesTotal,
} from "@/lib/actions/service.action";
import { cn, formatDate } from "@/lib/utils";
import { IconLoader } from "@tabler/icons-react";
import { usePathname } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

const PartialPayment = ({ client }: { client: any }) => {
  const [amount, setAmount] = React.useState<string>("0");
  const { selectedServices } = useServiceModal();
  const path = usePathname();

  const [loading, setLoading] = React.useState(false);

  // Calculate the total remaining amount from the selected services.
  // We assume each service has a "remainingAmount" property,
  // otherwise we fall back to the original "amount".
  const totalRemainingAmount = selectedServices.reduce(
    (acc, service) => acc + (service.remainingAmount ?? service.amount),
    0
  );

  const handlePartialPayment = async () => {
    setLoading(true);
    const selectedServiceIds = selectedServices.map((service) => service._id);
    if (selectedServiceIds.length === 0) return;

    try {
      const res = await partialPaymentSelected({
        amount: parseFloat(amount),
        selectedServiceIds,
        path,
      });
      if (selectedServices.length > 0) {
        const clientId = selectedServices[0].clientId;
        await syncOwesTotal(clientId);
      }
      if (res.success) {
        toast.success("Η μερική εξόφληση ολοκληρώθηκε επιτυχώς.");
      }
    } catch (error) {
      console.error("Error processing partial payment:", error);
      toast.error("Η μερική εξόφληση απέτυχε.");
    } finally {
      window.location.reload();
      setLoading(false);
    }
  };

  if (selectedServices.length === 0) {
    return (
      <div className="flex h-full w-full flex-col items-center gap-8 px-4 py-8 dark:text-white">
        <h1 className="self-start text-2xl">Μερική Εξόφληση</h1>
        <p className="text-light-900">Δεν υπάρχουν επιλεγμένες υπηρεσίες.</p>
      </div>
    );
  }

  return (
    <div className="flex h-full w-full flex-col items-center gap-8 px-4 py-8 dark:text-white">
      <h1 className="self-start text-2xl">Μερική Εξόφληση</h1>
      {/* Client Info */}
      <div className="flex w-full flex-row justify-between px-4 text-lg">
        <p className="text-light-900">Όνομα: {client?.client?.name}</p>
        <p className="text-light-900">
          Τηλέφωνο: {client?.client?.phone?.mobile}
        </p>
      </div>
      <div className="flex w-full flex-row justify-between px-4 text-lg">
        <p className="text-light-900">
          Ημερομηνία: {formatDate(new Date(), "el")}
        </p>
        <p className="text-light-900">
          Σύνολο Υπολοίπου: {totalRemainingAmount.toFixed(2)}€
        </p>
      </div>

      {/* List of Selected Services */}
      <ScrollArea className="flex w-full">
        {selectedServices.map((service) => (
          <Card
            key={service._id}
            className="mb-1 bg-neutral-100 shadow-sm dark:bg-neutral-900"
          >
            <CardHeader>
              <CardTitle className="text-lg font-medium">
                {service.serviceType}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-base">
              <p>Ημερομηνία: {formatDate(new Date(service.date), "el")}</p>
              <p>
                Ποσό: {service.amount}€ | Υπόλοιπο:{" "}
                {(service.remainingAmount ?? service.amount).toFixed(2)}€
              </p>
              {service.notes && <p>Σημειώσεις: {service.notes}</p>}
            </CardContent>
          </Card>
        ))}
      </ScrollArea>

      {/* Partial Payment Input */}
      <div className="flex flex-col items-center gap-8 px-8">
        <span className="text-xl">
          Εισάγετε το ποσό που θέλετε να εξοφλήσετε
        </span>
        <Input
          className="z-[9999] max-w-[20vw] text-light-900 placeholder:text-blue-500 focus:outline-none dark:border-neutral-600 dark:bg-neutral-800"
          placeholder="Ποσό"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          max={totalRemainingAmount}
        />
        <span
          className={cn(
            "ml-2 self-start text-sm text-blue-500",
            parseFloat(amount) <= 0 || parseFloat(amount) > totalRemainingAmount
              ? "text-red-500"
              : "text-green-500"
          )}
        >
          {amount || "0"}€
          {parseFloat(amount) > totalRemainingAmount && (
            <span className="ml-2 ">
              Το ποσό υπερβαίνει το σύνολο του υπολοίπου
            </span>
          )}
        </span>
      </div>

      <button
        className="w-full max-w-[20vw] rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
        onClick={handlePartialPayment}
        disabled={
          parseFloat(amount) <= 0 ||
          parseFloat(amount) > totalRemainingAmount ||
          loading
        }
      >
        {loading ? (
          <IconLoader className="animate-spin" size={24} />
        ) : (
          "Εξόφληση"
        )}
      </button>
    </div>
  );
};

export default PartialPayment;
