"use client";
import React from "react";

import { motion } from "framer-motion";

import { useServiceModal } from "@/hooks/use-service-modal";
import EditServices from "./ModalServiceActions/Edit/EditServices";
import ServicePayments from "./ModalServiceActions/Payments/ServicePayments";

import PrintServices from "./ModalServiceActions/Print/PrintServices";
import PartialPayment from "./ModalServiceActions/Payments/PartialPayment";
import DeleteServices from "./ModalServiceActions/Payments/DeleteServices";
import Discount from "./ModalServiceActions/Payments/Discount";
import TaxService from "./ModalServiceActions/Payments/TaxService";

const ServiceModal = (client: any) => {
  const { selectedServices, type, onClose } = useServiceModal();

  const renderContent = () => {
    switch (type) {
      case "Edit":
        return <EditServices />;
      case "Payment":
        return <ServicePayments />;
      case "Print":
        return <PrintServices client={client} />;
      case "PartialPayment":
        return <PartialPayment client={client} />;
      case "Tax":
        return <TaxService />;
      case "Delete":
        return <DeleteServices client={client} />;

      case "Discount":
        return <Discount client={client} />;
      default:
        return <div>No content to display</div>;
    }
  };

  return (
    <div>
      <Overlay onClose={onClose} />
      <motion.div
        className="absolute left-[20vw] top-[3vh] z-[9999] h-[85vh] w-full min-w-[60vw] max-w-md rounded-lg  bg-light-700 p-6 shadow-lg dark:bg-dark-100"
        initial={{ scale: 0, opacity: 0 }} // Start from scaled down and invisible
        animate={{ scale: 1, opacity: 1 }} // Animate to full size and fully visible
        exit={{ scale: 0, opacity: 0 }} // Exit animation when closing
        transition={{ duration: 0.3 }}
        onClick={(e) => e.stopPropagation()}
        // Control the speed of the animation
      >
        {selectedServices.length === 0 && type !== "PartialPayment" ? (
          <p className="text-center text-lg">
            Δεν υπάρχουν επιλεγμένες υπηρεσίες.
          </p>
        ) : (
          <>{renderContent()}</>
        )}
      </motion.div>
    </div>
  );
};
const Overlay = ({
  className,
  onClose,
}: {
  className?: string;
  onClose: any;
}) => {
  return (
    <motion.div
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
        backdropFilter: "blur(10px)",
      }}
      exit={{
        opacity: 0,
        backdropFilter: "blur(0px)",
      }}
      className={`fixed inset-0 z-50 h-full w-full bg-black bg-opacity-50 ${className}`}
      onClick={() => onClose()}
    ></motion.div>
  );
};
export default ServiceModal;
