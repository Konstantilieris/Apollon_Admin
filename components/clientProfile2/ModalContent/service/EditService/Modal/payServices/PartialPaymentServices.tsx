import React from "react";
import { formatDate, cn } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import { Icon } from "@iconify/react";
import { toast } from "sonner";
import {
  Button,
  Card,
  CardBody,
  ScrollShadow,
  Input,
  Spinner,
  Chip,
  Badge,
} from "@heroui/react";
import { useModalStore } from "@/hooks/client-profile-store";
import { partialPaymentSelected } from "@/lib/actions/service.action";

const PartialPayServices = () => {
  const [loading, setLoading] = React.useState(false);
  const [partialAmount, setPartialAmount] = React.useState("");

  const path = usePathname();
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
  const distributedPayments = React.useMemo(() => {
    let amount = parseFloat(partialAmount) || 0;
    return modalData?.selectedServices?.map((service: any) => {
      if (amount <= 0) return 0;
      const applied = Math.min(service.remainingAmount, amount);
      amount -= applied;
      return applied;
    });
  }, [partialAmount, modalData?.selectedServices]);
  const handlePartialPayment = async () => {
    const amount = Number(partialAmount);

    if (!amount || amount <= 0 || amount > totalAmount) {
      toast.error(
        '"Σφάλμα", "Η μερική πληρωμή πρέπει να είναι μεγαλύτερη από 0 και μικρότερη από το συνολικό ποσό."'
      );
      return;
    }

    setLoading(true);

    try {
      const selectedServiceIds = modalData.selectedServices.map(
        (service: any) => service._id
      );
      const res = await partialPaymentSelected({
        amount: parseFloat(partialAmount),
        selectedServiceIds,
        path,
      });
      if (res.message === "success")
        toast.success("Η μερική πληρωμή ήταν επιτυχής!");
    } catch (error) {
      console.error("Error applying partial payment:", error);
      toast.error(
        '"Σφάλμα", "Η μερική πληρωμή απέτυχε. Παρακαλώ δοκιμάστε ξανά."'
      );
    } finally {
      setLoading(false);
      closeModal();
      router.refresh();
    }
  };

  if (modalData?.selectedServices?.length === 0) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center">
        <p className="text-lg">Δεν υπάρχουν επιλεγμένες υπηρεσίες.</p>
      </div>
    );
  }

  return (
    <div className="flex h-full w-full flex-col gap-4 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon
            icon="lucide:credit-card"
            className="text-success-500"
            width={24}
          />
          <h1 className="text-xl font-semibold tracking-widest">
            Έναντι Πληρωμή Υπηρεσιών
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
        {modalData?.selectedServices?.map((service: any, index: number) => (
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
                    {service.totalAmount}€
                  </span>
                </div>
                <div className="flex flex-row gap-2">
                  <div>
                    <Chip color="secondary" variant="flat" size="md">
                      Πληρώθηκε: {service.paidAmount.toFixed(2)}€
                    </Chip>
                    <Chip color="secondary" variant="flat" size="md">
                      Υπόλοιπο: {service.remainingAmount.toFixed(2)}€
                    </Chip>
                    <Chip color="secondary" variant="flat" size="md">
                      Έκπτωση: {service.discount.toFixed(2)}€
                    </Chip>
                  </div>
                </div>
                <Chip color="success" variant="flat" size="md">
                  Υπόλοιπο μετά την πληρωμή:{" "}
                  {(
                    service.remainingAmount - distributedPayments[index]
                  ).toFixed(2)}
                  €
                </Chip>
              </div>
            </CardBody>
          </Card>
        ))}
      </ScrollShadow>

      <Input
        type="number"
        label="Ποσό Μερικής Πληρωμής"
        className="max-w-[600px]"
        placeholder="Εισάγετε ποσό"
        max={totalAmount}
        value={partialAmount}
        onValueChange={setPartialAmount}
        startContent={<span className="text-small text-default-400">€</span>}
        isRequired
      />

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
          color="success"
          className="flex-1"
          isLoading={loading}
          onPress={handlePartialPayment}
          spinner={<Spinner size="sm" />}
          isDisabled={
            loading ||
            !partialAmount ||
            parseFloat(partialAmount) <= 0 ||
            parseFloat(partialAmount) > totalAmount
          }
        >
          {loading ? "Αναμονή" : "Μερική Πληρωμή"}
        </Button>
      </div>
    </div>
  );
};

export default PartialPayServices;
