"use client";
import { useModalStore } from "@/hooks/client-profile-store";
import { Modal, ModalContent } from "@heroui/modal";
import { useEffect, useState } from "react";

import EditBookingContent from "@/components/clientProfile2/ModalContent/service/EditService/Modal/EditBookingContent";
import ViewBookingContent from "@/components/clientProfile2/ModalContent/service/ViewBookingContent";

export default function ModalBookingProvider() {
  const [mount, setMount] = useState(false);
  const { isOpen, closeModal, modalType, modalData } = useModalStore();

  useEffect(() => {
    setMount(true);
  }, []);

  if (!mount) return null;

  const renderModal = () => {
    switch (modalType) {
      case "viewBooking":
        return <ViewBookingContent bookingId={modalData?.bookingId} />;
      case "editBooking":
        return <EditBookingContent bookingId={modalData?.bookingId} />;
      case "deleteBookings":
        return <></>;

      default:
        return <></>;
    }
  };
  if (!modalType) return null;

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={closeModal}
      size="full"
      backdrop="blur"
      scrollBehavior="inside"
    >
      <ModalContent className="overflow-auto px-8 font-sans">
        {(onClose) => renderModal()}
      </ModalContent>
    </Modal>
  );
}
