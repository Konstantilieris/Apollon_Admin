import React from "react";
import { cn } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import { Icon } from "@iconify/react";
import { toast } from "sonner";
import {
  Button,
  Card,
  CardBody,
  Input,
  Spinner,
  Chip,
  RadioGroup,
  Radio,
  ScrollShadow,
} from "@heroui/react";
import { useModalStore } from "@/hooks/client-profile-store";
import { discountSelectedServices } from "@/lib/actions/service.action";

type DiscountType = "percentage" | "fixed";

const ApplyDiscountToService = () => {
  const [loading, setLoading] = React.useState(false);
  const [discountType, setDiscountType] =
    React.useState<DiscountType>("percentage");
  const [discountValue, setDiscountValue] = React.useState("");
  const path = usePathname();
  const router = useRouter();

  const { modalData, closeModal } = useModalStore();

  const selectedServices = modalData?.selectedServices || [];

  const calculatedDiscounts = React.useMemo(() => {
    const value = Number(discountValue);
    return selectedServices.map((service: any) => {
      if (!value) return 0;
      return discountType === "percentage"
        ? (value / 100) * service.amount
        : value;
    });
  }, [selectedServices, discountValue, discountType]);

  const calculatedAmounts = selectedServices.map(
    (service: any, index: number) => {
      return service.amount - calculatedDiscounts[index];
    }
  );
  const totalDiscount = calculatedDiscounts.reduce(
    (acc: any, curr: any) => acc + curr,
    0
  );
  const handleApplyDiscount = async () => {
    const value = Number(discountValue);

    if (!value || value <= 0) {
      toast.error('"Σφάλμα", "Η έκπτωση πρέπει να είναι μεγαλύτερη από 0."');

      return;
    }

    if (discountType === "percentage" && value > 100) {
      toast.error(
        '"Σφάλμα", "Η ποσοστιαία έκπτωση δεν μπορεί να είναι μεγαλύτερη από 100%."'
      );
      return;
    }

    setLoading(true);

    try {
      await discountSelectedServices({
        services: selectedServices,
        discount: calculatedDiscounts,
        clientId: modalData.client._id,
        path,
      });

      toast.success(
        '"Επιτυχία", "Η έκπτωση εφαρμόστηκε επιτυχώς στις υπηρεσίες."'
      );
    } catch (error) {
      toast.error(
        '"Σφάλμα", "Η εφαρμογή της έκπτωσης απέτυχε. Παρακαλώ δοκιμάστε ξανά."'
      );
    } finally {
      setLoading(false);
      closeModal();
      router.refresh();
    }
  };

  if (selectedServices.length === 0) {
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
          <Icon icon="lucide:tag" className="text-success-500" width={24} />
          <h1 className="text-xl font-semibold tracking-widest">
            Εφαρμογή Έκπτωσης
          </h1>
        </div>
      </div>

      <ScrollShadow className="h-[80vh] max-h-[900px]">
        {selectedServices.map((service: any, index: number) => (
          <Card key={service._id} className="mb-4" shadow="sm">
            <CardBody className="gap-2">
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon
                      icon="lucide:briefcase"
                      className="text-default-400"
                      width={20}
                    />
                    <span className="font-medium">{service.serviceType}</span>
                  </div>
                </div>
                <div className="text-sm text-default-500">
                  Αρχικό Ποσό: {service.amount.toFixed(2)}€
                </div>
              </div>
              <div className="flex flex-row gap-2">
                <Chip
                  color="secondary"
                  variant="flat"
                  size="lg"
                  startContent={<Icon icon="lucide:badge-percent" width={18} />}
                >
                  Συνολική Έκπτωση: {totalDiscount.toFixed(2)}€
                </Chip>
                <Chip
                  color="success"
                  variant="flat"
                  size="lg"
                  startContent={<Icon icon="lucide:euro" width={14} />}
                >
                  Τελικό: {calculatedAmounts[index]?.toFixed(2)}€
                </Chip>
              </div>
            </CardBody>
          </Card>
        ))}
      </ScrollShadow>

      <div className="flex flex-col gap-4">
        <RadioGroup
          label="Τύπος Έκπτωσης"
          orientation="horizontal"
          color="secondary"
          value={discountType}
          onValueChange={setDiscountType as (value: string) => void}
        >
          <Radio value="percentage">Ποσοστό (%)</Radio>
          <Radio value="fixed">Σταθερό Ποσό (€)</Radio>
        </RadioGroup>

        <Input
          type="number"
          label={
            discountType === "percentage"
              ? "Ποσοστό Έκπτωσης (%)"
              : "Ποσό Έκπτωσης (€)"
          }
          className="max-w-[600px]"
          placeholder={`Εισάγετε ${
            discountType === "percentage" ? "ποσοστό" : "ποσό"
          }`}
          value={discountValue}
          onValueChange={setDiscountValue}
          startContent={
            <span className="text-small text-default-400">
              {discountType === "percentage" ? "%" : "€"}
            </span>
          }
          description={
            discountType === "percentage"
              ? "Εισάγετε το ποσοστό έκπτωσης (π.χ. 20 για έκπτωση 20%)"
              : "Εισάγετε το ποσό έκπτωσης σε ευρώ"
          }
          isRequired
        />

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
            onPress={handleApplyDiscount}
            spinner={<Spinner size="sm" />}
          >
            {loading ? "Αναμονή" : "Εφαρμογή Έκπτωσης"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ApplyDiscountToService;
