import { ScrollArea } from "@/components/ui/scroll-area";
import { useServiceModal } from "@/hooks/use-service-modal";
import { deleteSelectedService } from "@/lib/actions/service.action";
import { formatDate, cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import React from "react";
import { useToast } from "@/components/ui/use-toast";

const DeleteServices = ({ client }: any) => {
  const [loading, setLoading] = React.useState(false);
  const path = usePathname();
  const { toast } = useToast();
  const { selectedServices, onClose } = useServiceModal();

  const handleAction = async () => {
    setLoading(true); // Set loading state to true

    try {
      await Promise.all(
        selectedServices.map((service) =>
          deleteSelectedService({
            service,
            path,
            clientId: client.client._id,
          })
        )
      );
      toast({
        title: "Επιτυχία",
        className: cn(
          "bg-celtic-green border-none text-white   text-center flex flex-center max-w-[300px] bottom-0 left-0 fixed font-sans "
        ),
        description: "Η διαγραφή ολοκληρώθηκε.",
      });
    } catch (error) {
      toast({
        title: "Error",
        className: cn(
          "bg-red-500 border-none text-white   text-center flex flex-center max-w-[300px] bottom-0 left-0 fixed font-sans "
        ),
        description: "Η διαγραφή απέτυχε.",
      });
    } finally {
      setLoading(false); // Set loading to false after completion
      onClose();
      window.location.reload();

      // Close the modal after success/failure
    }
  };
  return (
    <div className="flex h-full w-full flex-col justify-between">
      <h1 className="text-xl text-light-900 ">Διαγραφή Υπηρεσιών</h1>
      {selectedServices.length === 0 ? (
        <p className="text-lg">Δεν υπάρχουν επιλεγμένες υπηρεσίες.</p>
      ) : (
        <ScrollArea className="h-96">
          {selectedServices.map((service, index) => (
            <div
              key={service._id}
              className="mb-4 flex flex-col gap-2 border-b border-gray-300 px-4 pb-4 text-lg"
            >
              <p>Υπηρεσία: {service.serviceType}</p>
              <p className="ml-4">Σημειώση: {service.notes || "Ν/Α"}</p>
              <p className="ml-4">
                Ημερομηνία: {formatDate(new Date(service.date), "el")}
              </p>
              <p className="ml-4">Ποσό: {service.amount}€</p>
            </div>
          ))}
        </ScrollArea>
      )}
      <button
        className="mt-4 w-full rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
        onClick={handleAction}
      >
        {loading ? "Επεξεργασία..." : "Διαγραφή"}
      </button>
    </div>
  );
};

export default DeleteServices;
