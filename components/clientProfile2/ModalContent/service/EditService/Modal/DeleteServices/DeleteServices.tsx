import React from "react";

import { deleteSelectedService } from "@/lib/actions/service.action";
import { formatDate, cn } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import { Icon } from "@iconify/react";
import { toast } from "sonner";
import { Button, Card, CardBody, ScrollShadow } from "@heroui/react";
import { useModalStore } from "@/hooks/client-profile-store";

const DeleteServices = () => {
  const [loading, setLoading] = React.useState(false);
  const path = usePathname();
  const router = useRouter();

  const { modalData, closeModal } = useModalStore();
  const handleDelete = async () => {
    setLoading(true); // Set loading state to true

    try {
      await Promise.all(
        modalData.selectedServices.map((service: any) =>
          deleteSelectedService({
            service,
            path,
            clientId: modalData.client._id,
          })
        )
      );
      toast.success(`Οι υπηρεσίες διαγράφηκαν επιτυχώς!`);
    } catch (error) {
      toast.error(`Η διαγραφή των υπηρεσιών απέτυχε!`);
    } finally {
      setLoading(false); // Set loading to false after completion
      closeModal();
      router.refresh();

      // Close the modal after success/failure
    }
  };
  // if there are no selected services, display a message
  if (modalData?.selectedServices?.length === 0) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center">
        <p className="text-lg">Δεν υπάρχουν επιλεγμένες υπηρεσίες.</p>
      </div>
    );
  }

  return (
    <div className="flex h-full w-full flex-col gap-4 p-4">
      <div className="flex items-center gap-2">
        <Icon icon="lucide:trash-2" className="text-danger" width={24} />
        <h1 className="text-xl font-semibold tracking-widest">
          Διαγραφή Υπηρεσιών
        </h1>
      </div>

      <ScrollShadow className="h-[80vh] max-h-[900px]">
        {modalData?.selectedServices?.map((service: any) => (
          <Card key={service._id} className="mb-4" shadow="sm">
            <CardBody className="gap-2">
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <Icon
                    icon="lucide:briefcase"
                    className="text-default-400"
                    width={20}
                  />
                  <span className="font-medium">{service.serviceType}</span>
                </div>

                <div className="flex items-center gap-2 text-base text-default-500">
                  <Icon icon="lucide:calendar" className="mt-1" width={16} />
                  <span>{formatDate(new Date(service.date), "el")}</span>

                  {service.bookingId && service.serviceType === "ΔΙΑΜΟΝΗ" && (
                    <span>
                      {" "}
                      - {formatDate(new Date(service.endDate), "el")}
                    </span>
                  )}
                </div>
                <div className="flex items-start gap-2 text-base text-default-500">
                  <Icon icon="lucide:clipboard" className="mt-1" width={16} />
                  <span>{service.notes || "N/A"}</span>
                </div>
                <div className="flex items-center gap-2 text-base">
                  <Icon icon="lucide:credit-card" width={16} />
                  <span className="text-base font-medium">
                    {service.amount}€
                  </span>
                </div>
              </div>
            </CardBody>
          </Card>
        ))}
      </ScrollShadow>

      <div className="mt-4 flex gap-2">
        <Button
          variant="flat"
          color="default"
          className="flex-1"
          onPress={closeModal}
        >
          Ακύρωση
        </Button>
        <Button
          color="danger"
          className="flex-1"
          isLoading={loading}
          onPress={handleDelete}
          startContent={!loading && <Icon icon="lucide:trash-2" width={20} />}
        >
          {loading ? "Αναμονή" : "Διαγραφή"}
        </Button>
      </div>
    </div>
  );
};
export default DeleteServices;
