import { useServiceModal } from "@/hooks/use-service-modal";
import { payService } from "@/lib/actions/service.action";
import { cn, formatDate } from "@/lib/utils";
import React from "react";
import { useToast } from "@/components/ui/use-toast";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { usePathname } from "next/navigation";

const ServicePayments = () => {
  const { selectedServices, onClose } = useServiceModal();
  const path = usePathname();
  const { toast } = useToast();
  const [loading, setLoading] = React.useState(false);
  const handleAction = async () => {
    setLoading(true); // Set loading state to true

    try {
      await Promise.all(
        selectedServices.map((service) =>
          payService({ serviceId: service._id, path })
        )
      );
      toast({
        title: "Επιτυχία",
        className: cn(
          "bg-celtic-green border-none text-white   text-center flex flex-center max-w-[300px] bottom-0 left-0 fixed font-sans "
        ),
        description: "Η εξόφληση ολοκληρώθηκε.",
      });
    } catch (error) {
      console.error("Error paying off client:", error);
      toast({
        title: "Error",
        className: cn(
          "bg-red-500 border-none text-white   text-center flex flex-center max-w-[300px] bottom-0 left-0 fixed font-sans "
        ),
        description: "Η εξόφληση απέτυχε.",
      });
    } finally {
      setLoading(false); // Set loading to false after completion
      onClose();
      window.location.reload();

      // Close the modal after success/failure
    }
  };

  return (
    <div className="relative flex h-full w-full flex-col gap-4 px-2 py-4">
      <h1 className="text-xl text-light-900">Σύστημα Εξοφλήσεων</h1>

      {selectedServices.length === 0 ? (
        <p className="text-lg">Δεν υπάρχουν επιλεγμένες υπηρεσίες.</p>
      ) : (
        <ScrollArea className="  h-[60vh] w-full overflow-y-scroll">
          {selectedServices.map((service, index) => (
            <div
              key={service._id}
              className="mb-4 flex flex-col gap-2 border-b border-gray-300 px-4 pb-4 text-lg"
            >
              <p>
                &bull; Πληρωμή {service.serviceType}{" "}
                {formatDate(new Date(), "el")}
              </p>
              <p className="ml-6">
                Σημειώση: {service.notes ? service.notes : "Ν/Α"}
              </p>
              <p className="ml-6">
                Ημερομηνία: {formatDate(new Date(service.date), "el")}
              </p>
              <p className="ml-6">Ποσό: {service.amount}€</p>
            </div>
          ))}
        </ScrollArea>
      )}

      {selectedServices.length > 0 && (
        <button
          className="absolute bottom-0 w-full rounded bg-blue-500 px-4 py-2  text-white hover:bg-blue-600"
          onClick={() => handleAction()}
        >
          {loading ? "Επεξεργασία..." : "Εξόφληση"}
        </button>
      )}
    </div>
  );
};

export default ServicePayments;
