"use client";
import { useModalStore } from "@/hooks/client-profile-store";
import { Modal, ModalContent } from "@heroui/modal";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import DeleteDog from "./delete/DeleteDog";

const ServiceDetails = dynamic(
  () => import("./service/EditService/Modal/payments/ServiceDetails")
);
const ClientEditForm = dynamic(() => import("./info/ClientEditForm"));
const DogEditView = dynamic(() => import("./info/DogEditView"));
const CreateServiceView = dynamic(
  () => import("./service/EditService/Modal/CreateServiceView")
);
const DogCreateView = dynamic(() => import("./info/DogCreateView"));
const EditServiceView = dynamic(
  () => import("./service/EditService/Modal/EditServiceView")
);
const DeleteServices = dynamic(
  () => import("./service/EditService/Modal/DeleteServices/DeleteServices")
);
const FullPayServices = dynamic(
  () => import("./service/EditService/Modal/payServices/FullPayServices")
);
const PartialPaymentServices = dynamic(
  () => import("./service/EditService/Modal/payServices/PartialPaymentServices")
);
const ApplyTaxToService = dynamic(
  () => import("./service/EditService/Modal/payServices/ApplyTaxToService")
);
const ApplyDiscountToService = dynamic(
  () => import("./service/EditService/Modal/payServices/ApplyDiscountToService")
);
const ClientNotes = dynamic(() => import("./notes/clientNote"));
const DogNotes = dynamic(() => import("./notes/dogNote"));

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
      case "clientNotes":
        return <ClientNotes />; // Replace with actual component for client notes
      case "dogNotes":
        return <DogNotes />; // Replace with actual component for dog notes
      case "deleteDog":
        return <DeleteDog />; // Replace with actual component for deleting a dog
      case "serviceView":
        return <ServiceDetails />; // Replace with actual component for service view
      default:
        return null;
    }
  };

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
