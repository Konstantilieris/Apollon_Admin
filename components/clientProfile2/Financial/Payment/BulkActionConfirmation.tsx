import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@heroui/react";
import { Icon } from "@iconify/react";

interface BulkActionConfirmationProps {
  isOpen: boolean;
  actionType: string;
  count: number;
  onConfirm: () => void;
  onCancel: () => void;
}

export const BulkActionConfirmation: React.FC<BulkActionConfirmationProps> = ({
  isOpen,
  actionType,
  count,
  onConfirm,
  onCancel,
}) => {
  const getActionDetails = () => {
    switch (actionType) {
      case "reverse":
        return {
          title: "Αντιστροφή Πληρωμών",
          message: `Είστε σίγουροι ότι θέλετε να αντιστρέψετε ${count} πληρωμή${
            count !== 1 ? "ς" : ""
          };`,
          icon: "lucide:rotate-ccw",
          color: "warning",
          confirmText: "Αντιστροφή",
        };
      case "export":
        return {
          title: "Εξαγωγή Πληρωμών",
          message: `Εξαγωγή ${count} πληρωμή${count !== 1 ? "ς" : ""};`,
          icon: "lucide:download",
          color: "primary",
          confirmText: "Εξαγωγή",
        };
      case "delete":
        return {
          title: "Διαγραφή Πληρωμών",
          message: `Είστε σίγουροι ότι θέλετε να διαγράψετε ${count} πληρωμή${
            count !== 1 ? "ς" : ""
          }; Αυτή η ενέργεια δεν μπορεί να αναιρεθεί.`,
          icon: "lucide:trash-2",
          color: "danger",
          confirmText: "Διαγραφή",
        };
      default:
        return {
          title: "Επιβεβαίωση Ενέργειας",
          message: "Είστε σίγουροι ότι θέλετε να προχωρήσετε;",
          icon: "lucide:alert-circle",
          color: "primary",
          confirmText: "Επιβεβαίωση",
        };
    }
  };

  const details = getActionDetails();

  return (
    <Modal isOpen={isOpen} onClose={onCancel} size="5xl" backdrop="blur">
      <ModalContent className="p-4 font-sans">
        <ModalHeader className="flex items-center gap-2">
          <Icon
            icon={details.icon}
            className={`text-${details.color}`}
            width={20}
            height={20}
          />
          {details.title}
        </ModalHeader>
        <ModalBody>
          <p>{details.message}</p>
        </ModalBody>
        <ModalFooter>
          <Button variant="flat" onPress={onCancel}>
            Άκυρο
          </Button>
          <Button color={details.color as any} onPress={onConfirm}>
            {details.confirmText}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
