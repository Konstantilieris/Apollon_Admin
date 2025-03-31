"use client";
import React, { useState } from "react";
import { useServiceModal } from "@/hooks/use-service-modal";
import { payService } from "@/lib/actions/service.action";
import { cn, formatDate } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { usePathname } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const ServicePayments = () => {
  const { selectedServices, onClose } = useServiceModal();
  const path = usePathname();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleAction = async () => {
    setLoading(true);
    try {
      await Promise.all(
        selectedServices.map((service) =>
          payService({ serviceId: service._id, path })
        )
      );
      toast({
        title: "Επιτυχία",
        description: "Η εξόφληση ολοκληρώθηκε.",
        className: cn(
          "bg-celtic-green border-none text-white text-center flex items-center max-w-[300px] fixed bottom-0 left-0 font-sans"
        ),
      });
    } catch (error) {
      console.error("Error paying off client:", error);
      toast({
        title: "Error",
        description: "Η εξόφληση απέτυχε.",
        className: cn(
          "bg-red-500 border-none text-white text-center flex items-center max-w-[300px] fixed bottom-0 left-0 font-sans"
        ),
      });
    } finally {
      setLoading(false);
      onClose();
      window.location.reload();
    }
  };

  if (selectedServices.length === 0) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center p-8 text-white">
        <h1 className="text-2xl font-semibold">Σύστημα Εξοφλήσεων</h1>
        <p className="mt-4 text-lg">Δεν υπάρχουν επιλεγμένες υπηρεσίες.</p>
      </div>
    );
  }

  return (
    <div className="relative flex h-full w-full flex-col gap-6 p-4 text-white md:p-8 lg:p-10">
      <h1 className="text-2xl font-semibold">Σύστημα Εξοφλήσεων</h1>

      <ScrollArea className="h-[60vh] w-full">
        <div className="space-y-4">
          {selectedServices.map((service) => (
            <Card key={service._id} className="bg-neutral-900 shadow-md">
              <CardHeader>
                <CardTitle className="text-lg tracking-widest">
                  Πληρωμή {service.serviceType}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 pl-8 text-base">
                <p>
                  <strong className="tracking-wide">Ημερομηνία:</strong>{" "}
                  {formatDate(new Date(service.date), "el")}
                </p>
                <p>
                  <strong className="tracking-wide">Σημειώσεις:</strong>{" "}
                  {service.notes ? service.notes : "Ν/Α"}
                </p>
                <p>
                  <strong className="tracking-wide">Ποσό:</strong>{" "}
                  {service.amount}€
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>

      <div className="mt-auto">
        <Button
          className="w-full bg-blue-500 hover:bg-blue-600"
          onClick={handleAction}
          disabled={loading}
        >
          {loading ? "Επεξεργασία..." : "Εξόφληση"}
        </Button>
      </div>
    </div>
  );
};

export default ServicePayments;
