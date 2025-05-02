import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Textarea,
  DatePicker,
} from "@heroui/react";

import { toast } from "sonner";
import { today } from "@internationalized/date";
import { I18nProvider } from "@react-aria/i18n";
import { useRouter } from "next/navigation";
import { createIncome } from "@/lib/actions/service.action";

interface CreatePaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreatePaymentModal: React.FC<CreatePaymentModalProps> = ({
  isOpen,
  onClose,
}) => {
  const router = useRouter();
  const [formData, setFormData] = React.useState({
    amount: "",
    date: today("UTC"),
    serviceType: "",
    notes: "",
  });

  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    // Validate form
    if (!formData.amount || isNaN(parseFloat(formData.amount))) {
      return;
    }
    try {
      const res = await createIncome({
        amount: parseFloat(formData.amount),
        date: formData.date.toDate("UTC"),
        serviceType: formData.serviceType,
        notes: formData.notes,
      });
      if (!res) {
        toast.error("Σφάλμα κατά την καταχώρηση της πληρωμής.");
        setIsSubmitting(false);
        return;
      }
      toast.success("Η πληρωμή καταχωρήθηκε επιτυχώς!");
    } catch (error) {
      toast.error("Σφάλμα κατά την καταχώρηση της πληρωμής.");
      setIsSubmitting(false);
      return;
    } finally {
      setFormData({
        amount: "",
        date: today("UTC"),
        serviceType: "",
        notes: "",
      });

      setIsSubmitting(false);
      onClose();
      router.refresh();
    }

    // Reset form
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="5xl">
      <ModalContent className="p-4 font-sans">
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1 ">
              Καταχώρηση Πληρωμής
            </ModalHeader>
            <ModalBody>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Input
                  label="Ποσό"
                  classNames={{
                    label: "text-base tracking-wide",
                  }}
                  placeholder="0.00"
                  startContent={
                    <div className="pointer-events-none flex items-center">
                      <span className="text-small text-default-400">€</span>
                    </div>
                  }
                  value={formData.amount}
                  onValueChange={(value) => handleInputChange("amount", value)}
                  isRequired
                />
                <div>
                  <I18nProvider locale="el-GR">
                    <DatePicker
                      classNames={{
                        label: "text-base tracking-wide",
                      }}
                      label="Ημερομηνία Πληρωμής"
                      value={formData.date}
                      onChange={(date) => handleInputChange("date", date)}
                    />
                  </I18nProvider>
                </div>
                <Input
                  classNames={{
                    label: "text-base tracking-wide",
                  }}
                  label="Τύπος Υπηρεσίας"
                  placeholder="Εισάγετε τύπο υπηρεσίας"
                  value={formData.serviceType}
                  onValueChange={(value) =>
                    handleInputChange("serviceType", value)
                  }
                  isRequired
                />
              </div>

              <Textarea
                classNames={{
                  label: "text-base tracking-wide",
                }}
                label="Σημειώσεις"
                placeholder="Εισάγετε σημειώσεις πληρωμής"
                value={formData.notes}
                onValueChange={(value) => handleInputChange("notes", value)}
                className="mt-4"
              />
            </ModalBody>
            <ModalFooter>
              <Button
                variant="flat"
                onPress={onClose}
                className="text-base tracking-wide"
              >
                Ακύρωση
              </Button>
              <Button
                color="success"
                variant="bordered"
                className="text-base tracking-wide"
                onPress={handleSubmit}
                isLoading={isSubmitting}
              >
                Καταχώρηση Εσόδου
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
