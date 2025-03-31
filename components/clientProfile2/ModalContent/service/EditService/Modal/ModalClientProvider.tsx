"use client";
import { useModalStore } from "@/hooks/client-profile-store";
import { Modal, ModalContent } from "@heroui/modal";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const ClientEditForm = dynamic(() => import("../../../info/ClientEditForm"));
const DogEditView = dynamic(() => import("../../../info/DogEditView"));
const CreateServiceView = dynamic(() => import("./CreateServiceView"));
const DogCreateView = dynamic(() => import("../../../info/DogCreateView"));
const EditServiceView = dynamic(() => import("./EditServiceView"));
const DeleteServices = dynamic(() => import("./DeleteServices/DeleteServices"));
const FullPayServices = dynamic(() => import("./payServices/FullPayServices"));
const PartialPaymentServices = dynamic(
  () => import("./payServices/PartialPaymentServices")
);
const ApplyTaxToService = dynamic(
  () => import("./payServices/ApplyTaxToService")
);
const ApplyDiscountToService = dynamic(
  () => import("./payServices/ApplyDiscountToService")
);

export default function ModalClientProvider() {
  const [mount, setMount] = useState(false);
  const { isOpen, closeModal, modalType } = useModalStore();

  useEffect(() => {
    setMount(true);
  }, []);

  if (!mount) return null;

  const renderModal = () => {
    switch (modalType) {
      case "clientInfo":
        return <ClientEditForm />;
      case "createDog":
        return <DogCreateView />;
      case "editDog":
        return <DogEditView />;
      case "createService":
        return <CreateServiceView />;
      case "editService":
        return <EditServiceView />;
      case "deleteServices":
        return <DeleteServices />;
      case "fullPayServices":
        return <FullPayServices />;
      case "partialPayService":
        return <PartialPaymentServices />;
      case "taxService":
        return <ApplyTaxToService />;
      case "discountService":
        return <ApplyDiscountToService />;
      default:
        return null;
    }
  };

  return (
    <>
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
    </>
  );
}
