import React, { useRef } from "react";
import { Service } from "./OwesTab";
import { motion } from "framer-motion";
import { useOutsideClick } from "@/hooks/use-outside-click";
import { formatDate } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { payService } from "@/lib/actions/service.action";

import { useServiceModal } from "@/hooks/use-service-modal";

const handleAction = async (
  type: string,
  service: Service,
  onClose: () => void,
  path: string
) => {
  switch (type) {
    case "Payment":
      try {
        await payService({ service, path });
        onClose();
        window.location.reload();
      } catch (error) {
        console.error("Error paying off client:", error);
        throw error;
      }
      break;
    default:
  }
};
const renderContent = (
  type: string,
  service: Service,
  onClose: () => void,
  path: string
) => {
  switch (type) {
    case "Payment":
      return (
        <div className="relative flex h-full w-full flex-col gap-4 px-2 py-4">
          <h1 className="text-xl text-light-900"> Σύστημα Πληρωμών</h1>
          <div className="flex flex-col gap-2 px-4 text-lg">
            <p className="">
              Πληρωμή {service.serviceType} {formatDate(new Date(), "el")}
            </p>
            <p className="ml-4">
              Σημειώση: {service.notes ? service.notes : "Ν/Α"}
            </p>
            <p className="ml-4">
              Ημερομηνία: {formatDate(new Date(service.date), "el")}
            </p>
            <p className="ml-4">Ποσό: {service.amount}€</p>
          </div>
          <button
            className="absolute bottom-0 w-full rounded bg-green-500 px-4  py-2 text-white hover:bg-green-600"
            onClick={() => handleAction(type, service, onClose, path)}
          >
            Πληρωμή
          </button>
        </div>
      );
    case "Edit":
      return (
        <div>
          <p>Edit</p>
        </div>
      );
    case "Delete":
      return (
        <div>
          <p>Delete</p>
        </div>
      );
    default:
      return null;
  }
};

const ServiceModal: React.FC = () => {
  const { currentData, onClose, resetCurrentData } = useServiceModal();
  const { service, type } = currentData;
  const ref = useRef(null);
  useOutsideClick(ref, () => {
    resetCurrentData();
    onClose();
  });
  const path = usePathname();
  return (
    <motion.div
      ref={ref}
      className="absolute  left-[30vw] top-[19.2vh] z-50 h-[45vh] w-full min-w-[35vw] max-w-md rounded-lg border border-purple-950 bg-light-700 p-6 shadow-lg dark:bg-dark-100 "
      initial={{ scale: 0, opacity: 0 }} // Start from scaled down and invisible
      animate={{ scale: 1, opacity: 1 }} // Animate to full size and fully visible
      exit={{ scale: 0, opacity: 0 }} // Exit animation when closing
      transition={{ duration: 0.3 }} // Control the speed of the animation
    >
      {service ? renderContent(type, service, onClose, path) : null}
    </motion.div>
  );
};

export default ServiceModal;
