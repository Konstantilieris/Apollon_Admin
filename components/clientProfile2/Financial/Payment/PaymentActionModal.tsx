import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
} from "@heroui/react";
import { formatCurrency, formatDate } from "@/lib/utils";
import {
  reversePayment,
  removePaymentSafely,
} from "@/lib/actions/service.action";
import { toast } from "sonner";
import React, { useState } from "react";

export function PaymentActionModal({
  isOpen,
  onClose,
  payment,
  action,
}: {
  isOpen: boolean;
  onClose: () => void;
  payment: any;
  action: string | null;
}) {
  const [note, setNote] = useState(payment?.notes || "");
  const [loading, setLoading] = useState(false);

  const handleReverse = async () => {
    setLoading(true);
    try {
      await reversePayment({ paymentId: payment.id, path: "/payments" });
      toast.success("Ακυρώθηκε επιτυχώς.");
      onClose();
    } catch {
      toast.error("Αποτυχία ακύρωσης.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      await removePaymentSafely({ paymentId: payment.id, path: "/payments" });
      toast.success("Διαγράφηκε επιτυχώς.");
      onClose();
    } catch {
      toast.error("Αποτυχία διαγραφής.");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveNote = () => {
    toast.success("Η σημείωση αποθηκεύτηκε (mock).");
    onClose();
  };

  if (!payment || !action) return null;

  let modalTitle = "";
  let bodyContent = null;
  let footerContent = null;

  switch (action) {
    case "view-details":
      modalTitle = "Λεπτομέρειες Πληρωμής";
      bodyContent = (
        <>
          <p>
            <strong>Πελάτης:</strong> {payment.clientName}
          </p>
          <p>
            <strong>Ημερομηνία:</strong> {formatDate(payment.date, "el")}
          </p>
          <p>
            <strong>Ποσό:</strong> {formatCurrency(payment.amount)}
          </p>
          <p>
            <strong>Κατάσταση:</strong>{" "}
            {payment.reversed ? "Ακυρωμένη" : "Έγκυρη"}
          </p>
          <p>
            <strong>Σημειώσεις:</strong> {payment.notes || "—"}
          </p>
        </>
      );
      footerContent = <Button onPress={onClose}>Κλείσιμο</Button>;
      break;

    case "reverse-payment":
      modalTitle = "Επιβεβαίωση Ακύρωσης";
      bodyContent = (
        <p>
          Είστε βέβαιοι ότι θέλετε να <strong>ακυρώσετε</strong> αυτήν την
          πληρωμή;
        </p>
      );
      footerContent = (
        <>
          <Button variant="light" onPress={onClose}>
            Άκυρο
          </Button>
          <Button color="warning" onPress={handleReverse} isLoading={loading}>
            Ακύρωση
          </Button>
        </>
      );
      break;

    case "edit-notes":
      modalTitle = "Επεξεργασία Σημειώσεων";
      bodyContent = (
        <Input
          label="Νέες σημειώσεις"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
      );
      footerContent = (
        <>
          <Button variant="light" onPress={onClose}>
            Άκυρο
          </Button>
          <Button color="primary" onPress={handleSaveNote}>
            Αποθήκευση
          </Button>
        </>
      );
      break;

    case "delete-payment":
      modalTitle = "Επιβεβαίωση Διαγραφής";
      bodyContent = (
        <p>
          Θέλετε σίγουρα να <strong>διαγράψετε</strong> αυτήν την πληρωμή; Η
          ενέργεια είναι μη αναστρέψιμη.
        </p>
      );
      footerContent = (
        <>
          <Button variant="light" onClick={onClose}>
            Άκυρο
          </Button>
          <Button color="danger" onClick={handleDelete} isLoading={loading}>
            Διαγραφή
          </Button>
        </>
      );
      break;
  }

  return (
    <Modal isOpen={isOpen} onOpenChange={onClose} size="5xl">
      <ModalContent className="font-sans text-lg">
        <ModalHeader>{modalTitle}</ModalHeader>
        <ModalBody>{bodyContent}</ModalBody>
        <ModalFooter>{footerContent}</ModalFooter>
      </ModalContent>
    </Modal>
  );
}
