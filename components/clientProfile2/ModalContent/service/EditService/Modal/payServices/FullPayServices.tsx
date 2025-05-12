import React from "react";
import { formatDate } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { Icon } from "@iconify/react";
import { toast } from "sonner";
import {
  Badge,
  Button,
  Card,
  CardBody,
  Chip,
  Divider,
  ScrollShadow,
} from "@heroui/react";
import { useModalStore } from "@/hooks/client-profile-store";
import { payMultipleServices } from "@/lib/actions/service.action";

const FullPayServices = () => {
  const [loading, setLoading] = React.useState(false);

  const router = useRouter();

  const { modalData, closeModal } = useModalStore();
  const totalAmount = React.useMemo(() => {
    return modalData?.selectedServices?.reduce(
      (sum: any, service: any) => sum + service.totalAmount,
      0
    );
  }, [modalData]);
  const totalRemainingAmount = React.useMemo(() => {
    return modalData?.selectedServices?.reduce(
      (sum: any, service: any) => sum + service.remainingAmount,
      0
    );
  }, [modalData]);

  if (modalData?.selectedServices?.length === 0) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center">
        <p className="text-lg">Δεν υπάρχουν επιλεγμένες υπηρεσίες.</p>
      </div>
    );
  }

  const handleFullPayment = async () => {
    setLoading(true);

    try {
      await payMultipleServices(
        modalData.selectedServices.map((s: any) => s._id)
      );

      toast.success("Η εξοφλήσεις ολοκληρώθηκαν επιτυχώς.");
    } catch (error) {
      console.error("Error paying off client:", error);
      toast.error("Η ενέργεια απέτυχε.");
    } finally {
      setLoading(false);
      closeModal();
      router.refresh();
    }
  };

  return (
    <div className="flex h-full w-full flex-col gap-4 p-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon
            icon="lucide:credit-card"
            className="text-success-500"
            width={24}
          />
          <h1 className="text-xl font-semibold tracking-widest">
            Εξόφληση Υπηρεσιών
          </h1>
        </div>
        <div className="flex flex-row gap-2 ">
          <Badge
            color="danger"
            variant="faded"
            size="sm"
            placement="top-left"
            className="p-4 tracking-widest"
            content={modalData?.selectedServices?.length ?? 0}
          >
            <Chip
              color="danger"
              variant="flat"
              size="lg"
              endContent={<Icon icon="lucide:euro" width={18} />}
              className="p-5 tracking-widest"
            >
              Συνολικες Οφειλές: {totalRemainingAmount?.toFixed(2)}
            </Chip>
          </Badge>
          <Badge
            color="success"
            variant="faded"
            size="sm"
            placement="top-left"
            className="p-4 tracking-widest"
            content={modalData?.selectedServices?.length ?? 0}
          >
            <Chip
              color="success"
              variant="flat"
              size="lg"
              endContent={<Icon icon="lucide:euro" width={18} />}
              className="p-5 tracking-widest"
            >
              Συνολικό Ποσό: {totalAmount?.toFixed(2)}
            </Chip>
          </Badge>
        </div>
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

      <Card className="mt-2" shadow="sm">
        <CardBody>
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-default-500">Ποσό προς πληρωμή:</span>
              <span className="text-xl font-semibold text-success-500">
                {totalRemainingAmount?.toFixed(2)}€
              </span>
            </div>
            <Divider className="my-2" />
            <div className="flex gap-2">
              <Button
                variant="flat"
                color="default"
                className="flex-1"
                onPress={closeModal}
              >
                Ακύρωση
              </Button>
              <Button
                color="success"
                className="flex-1"
                isLoading={loading}
                onPress={handleFullPayment}
                startContent={
                  !loading && <Icon icon="lucide:credit-card" width={20} />
                }
              >
                {loading
                  ? "Αναμονή"
                  : `Πληρωμή ${totalRemainingAmount?.toFixed(2)}€`}
              </Button>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default FullPayServices;
