import { ScrollArea } from "@/components/ui/scroll-area";
import { useServiceModal } from "@/hooks/use-service-modal";
import { formatDate } from "@/lib/utils";
import React from "react";
import { usePathname } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { discountSelectedServices } from "@/lib/actions/service.action";

const Discount = ({ client }: any) => {
  const { selectedServices = [], onClose } = useServiceModal();
  const [loading, setLoading] = React.useState(false);
  const [discount, setDiscount] = React.useState<number[]>([]);
  const [finalAmount, setFinalAmount] = React.useState<number[]>([]);

  const path = usePathname();
  const { toast } = useToast();

  // Initialize discount and finalAmount when selectedServices changes
  React.useEffect(() => {
    setDiscount(Array(selectedServices.length).fill(0));
    setFinalAmount(
      selectedServices.map((service: any) => service.remainingAmount)
    );
  }, [selectedServices]);

  // Update finalAmount when discount changes
  React.useEffect(() => {
    setFinalAmount(
      selectedServices.map(
        (service: any, index) =>
          service.remainingAmount - (discount[index] || 0)
      )
    );
  }, [discount, selectedServices]);

  if (selectedServices.length === 0) {
    return (
      <p className="text-center text-lg">Δεν υπάρχουν επιλεγμένες υπηρεσίες.</p>
    );
  }

  const handleAction = async () => {
    try {
      setLoading(true);
      // call server Action here
      await discountSelectedServices({
        services: selectedServices,
        discount,
        clientId: client.client._id,
        path,
      });

      toast({
        title: "Επιτυχής Επεξεργασία",
        description: "Οι εκπτώσεις αποθηκεύτηκαν.",
        className: "bg-celtic-green",
      });
      onClose();
    } catch (error) {
      toast({
        title: "Σφάλμα",
        description: "Κάτι πήγε στραβά. Προσπαθήστε ξανά.",
        className: "bg-red-500",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="absolute inset-0 flex h-full w-full flex-col gap-4 px-2 py-4">
      <div className="mt-4 flex flex-row items-center px-2">
        <h1 className="text-xl text-light-900">Σύστημα Εκπτώσεων</h1>
      </div>
      <ScrollArea className="mt-20 h-[60vh] w-full overflow-y-scroll px-8">
        {selectedServices.map((service: any, index) => (
          <div
            key={service._id}
            className="mb-4 flex flex-col gap-2 space-y-4 border-b border-gray-300 px-4 pb-4 text-lg"
          >
            <p>
              &bull; Εκπτωση στην υπηρεσία {service.serviceType}{" "}
              {formatDate(new Date(), "el")}
            </p>
            <p className="ml-6">
              Σημειώση: {service.notes ? service.notes : "Ν/Α"}
            </p>
            <p className="ml-6">
              Ημερομηνία: {formatDate(new Date(service.date), "el")}
            </p>
            <p className="ml-6">Αρχικό Ποσό: {service.remainingAmount}€</p>
            <p className="ml-6 flex flex-row items-center gap-4">
              Εκπτωση:{" "}
              <Input
                className="w-20 "
                type="number"
                value={discount[index]}
                onChange={(e) => {
                  const value = parseFloat(e.target.value) || 0;
                  // Check if the value is less than or equal to the remaining amount and positive
                  if (value <= service.remainingAmount && value >= 0) {
                    const newAmount = [...discount];
                    newAmount[index] = value;
                    setDiscount(newAmount);
                  }
                }}
              />{" "}
              €
            </p>
            <p className="ml-6">Τελικό Ποσό: {finalAmount[index]}€</p>
          </div>
        ))}
      </ScrollArea>
      <div className="mt-4 flex items-center justify-center">
        <button
          className="w-full rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
          onClick={handleAction}
        >
          {loading ? "Επεξεργασία..." : "Aποθήκευση"}
        </button>
      </div>
    </div>
  );
};

export default Discount;
