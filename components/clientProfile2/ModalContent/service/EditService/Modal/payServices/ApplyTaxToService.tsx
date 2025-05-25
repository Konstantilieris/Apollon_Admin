import React from "react";

import { usePathname, useRouter } from "next/navigation";
import { Icon } from "@iconify/react";
import { toast } from "sonner";
import { Button, Card, CardBody, Input, Spinner, Chip } from "@heroui/react";
import { useModalStore } from "@/hooks/client-profile-store";
import { updateTaxForSelectedServices } from "@/lib/actions/service.action";

const ApplyTaxToService = () => {
  const [loading, setLoading] = React.useState(false);
  const [taxPercentage, setTaxPercentage] = React.useState("");
  const path = usePathname();
  const router = useRouter();

  const { modalData, closeModal } = useModalStore();

  const selectedService = modalData?.service;

  const calculatedAmount = React.useMemo(() => {
    if (!selectedService?.amount || !taxPercentage) return null;
    const tax = (Number(taxPercentage) / 100) * selectedService.amount;
    return selectedService.amount + tax;
  }, [selectedService, taxPercentage]);

  const handleApplyTax = async () => {
    const percentage = Number(taxPercentage);

    if (!percentage || percentage <= 0) {
      toast.error('"Σφάλμα", "Ο φόρος πρέπει να είναι μεγαλύτερος από 0."');
      return;
    }

    setLoading(true);

    try {
      // Replace with your actual API call
      const res = await updateTaxForSelectedServices({
        selectedServiceIds: selectedService._id,
        taxRate: percentage,
        path,
      });
      if (res.message === "success")
        toast.success("Η εφαρμογή του φόρου ήταν επιτυχής!");
    } catch (error) {
      toast.error(
        '"Σφάλμα", "Η εφαρμογή του φόρου απέτυχε. Παρακαλώ δοκιμάστε ξανά."'
      );
    } finally {
      setLoading(false);
      closeModal();
      router.refresh();
    }
  };

  if (!selectedService) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center">
        <p className="text-lg">Δεν υπάρχει επιλεγμένη υπηρεσία.</p>
      </div>
    );
  }

  return (
    <div className="flex h-full w-full flex-col gap-4 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon icon="lucide:percent" className="text-warning" width={24} />
          <h1 className="text-xl font-semibold tracking-widest">
            Εφαρμογή Φόρου
          </h1>
        </div>
      </div>

      <Card className="mb-4" shadow="sm">
        <CardBody className="gap-2">
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Icon
                  icon="lucide:briefcase"
                  className="text-default-400"
                  width={20}
                />
                <span className="font-medium">
                  {selectedService.serviceType}
                </span>
              </div>
            </div>
            <div className="flex flex-row gap-2">
              <Chip
                color="default"
                variant="flat"
                size="lg"
                startContent={<Icon icon="lucide:euro" width={18} />}
              >
                Αρχικό Ποσό: {selectedService.amount?.toFixed(2)}€
              </Chip>
              {calculatedAmount && (
                <Chip
                  color="success"
                  variant="flat"
                  size="lg"
                  startContent={<Icon icon="lucide:euro" width={14} />}
                >
                  Τελικό: {calculatedAmount.toFixed(2)}€
                </Chip>
              )}
            </div>
          </div>
        </CardBody>
      </Card>

      <div className="flex flex-col gap-4">
        <Input
          type="number"
          label="Ποσοστό Φόρου (%)"
          className="max-w-[600px]"
          placeholder="Εισάγετε ποσοστό"
          value={taxPercentage}
          onValueChange={setTaxPercentage}
          startContent={<span className="text-small text-default-400">%</span>}
          description="Εισάγετε το ποσοστό φόρου (π.χ. 24 για ΦΠΑ 24%)"
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
            color="warning"
            className="flex-1 font-bold tracking-widest"
            isLoading={loading}
            onPress={handleApplyTax}
            spinner={<Spinner size="sm" />}
          >
            {loading ? "Αναμονή" : "Εφαρμογή Φόρου"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ApplyTaxToService;
