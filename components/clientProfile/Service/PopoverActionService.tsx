import React, { useRef, useState } from "react";
import { Service } from "./OwesTab";
import { motion } from "framer-motion";
import { useOutsideClick } from "@/hooks/use-outside-click";
import { formatDate } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { payService } from "@/lib/actions/service.action";
import { useReactToPrint } from "react-to-print";
import { useServiceModal } from "@/hooks/use-service-modal";
import { useToast } from "@/components/ui/use-toast";
import LoadingSkeleton from "@/components/shared/skeletons/LoadingSkeleton";

// Function to handle actions (like Payment, Delete)
const handleAction = async (
  type: string,
  services: Service[],
  onClose: () => void,
  path: string,
  setLoading: (loading: boolean) => void,
  toast: any
) => {
  setLoading(true); // Set loading state to true
  switch (type) {
    case "Payment":
      try {
        await Promise.all(
          services.map((service) => payService({ service, path }))
        );
        toast({
          title: "Success",
          description: "Payment processed successfully.",
          status: "success",
        });
      } catch (error) {
        console.error("Error paying off client:", error);
        toast({
          title: "Error",
          description: "There was an issue processing the payment.",
          status: "error",
        });
      } finally {
        setLoading(false); // Set loading to false after completion
        onClose(); // Close the modal after success/failure
      }
      break;
    default:
      break;
  }
};

// PrintableTable component for printing selected services
const PrintableReceipt = React.forwardRef(
  (
    { selectedServices, client }: { selectedServices: Service[]; client: any },
    ref: any
  ) => (
    <div ref={ref} className="p-4">
      {/* Receipt Header */}
      <div className="mb-4 text-center">
        <h1 className="text-2xl font-bold">ΑΠΟΛΛΩΝ ΣΧΟΛΗ ΣΚΥΛΩΝ</h1>
        <h2 className="text-xl font-bold">ΠΡΟΣΦΟΡΑ</h2>
        <p className="text-lg">
          {new Date().toLocaleDateString("el-GR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })}
        </p>
        <p className="text-lg">ΠΕΛΑΤΗΣ: {client.client.name}</p>
      </div>

      {/* Services Table */}
      <table className="min-w-full table-auto">
        <thead>
          <tr>
            <th className="py-2 text-left">Υπηρεσία</th>
            <th className="py-2 text-left">Ημερομηνία</th>
            <th className="py-2 text-right">Ποσό</th>
          </tr>
        </thead>
        <tbody>
          {selectedServices.length === 0 ? (
            <tr>
              <td colSpan={3} className="py-4 text-center">
                Δεν υπάρχουν επιλεγμένες υπηρεσίες.
              </td>
            </tr>
          ) : (
            selectedServices.map((service) => (
              <tr key={service._id}>
                <td className="py-2">{service.serviceType}</td>
                <td className="py-2">
                  {new Date(service.date).toLocaleDateString("el-GR", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })}
                </td>
                <td className="py-2 text-right">{service.amount}€</td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Subtotal, Tax, Total */}
      <div className="mt-6 border-t border-gray-200 pt-4">
        <div className="flex justify-between">
          <span className="font-bold">ΥΠΟΣΥΝΟΛΟ:</span>
          <span className="font-bold">
            {selectedServices.reduce((sum, service) => sum + service.amount, 0)}
            €
          </span>
        </div>
        <div className="flex justify-between">
          <span className="font-bold">ΦΠΑ (24%):</span>
          <span className="font-bold">
            {(
              selectedServices.reduce(
                (sum, service) => sum + service.amount,
                0
              ) * 0.24
            ).toFixed(2)}
            €
          </span>
        </div>
        <div className="mt-2 flex justify-between border-t border-gray-200 pt-2">
          <span className="text-lg font-bold">ΣΥΝΟΛΟ:</span>
          <span className="text-lg font-bold">
            {(
              selectedServices.reduce(
                (sum, service) => sum + service.amount,
                0
              ) * 1.24
            ).toFixed(2)}
            €
          </span>
        </div>
      </div>

      {/* Thank You Message */}
      <div className="mt-6 text-center">
        <p className="text-sm">Ευχαριστούμε για την προτίμηση!</p>
      </div>
    </div>
  )
);

PrintableReceipt.displayName = "PrintableReceipt";
// Assign a display name to the forwardRef component to avoid the warning

// Function to render modal content based on the type
const renderContent = (
  type: string,
  selectedServices: Service[],
  onClose: () => void,
  path: string,
  handlePrint: () => void,
  printRef: React.RefObject<any>,
  toast: any,
  loading: boolean, // Add loading state
  setLoading: any,
  client: any // Pass loading state
) => {
  if (loading) {
    return <LoadingSkeleton size={200} animation="animate-pulse" />; // Show loading message or spinner
  }

  switch (type) {
    case "Payment":
      return (
        <div className="relative flex h-full w-full flex-col gap-4 px-2 py-4">
          <h1 className="text-xl text-light-900">Σύστημα Εξοφλήσεων</h1>

          {selectedServices.length === 0 ? (
            <p className="text-lg">Δεν υπάρχουν επιλεγμένες υπηρεσίες.</p>
          ) : (
            selectedServices.map((service, index) => (
              <div
                key={service._id}
                className="mb-4 flex flex-col gap-2 border-b border-gray-300 px-4 pb-4 text-lg"
              >
                <p>
                  &bull; Πληρωμή {service.serviceType}{" "}
                  {formatDate(new Date(), "el")}
                </p>
                <p className="ml-6">
                  Σημειώση: {service.notes ? service.notes : "Ν/Α"}
                </p>
                <p className="ml-6">
                  Ημερομηνία: {formatDate(new Date(service.date), "el")}
                </p>
                <p className="ml-6">Ποσό: {service.amount}€</p>
              </div>
            ))
          )}

          {selectedServices.length > 0 && (
            <button
              className="absolute bottom-0 w-full rounded bg-green-500 px-4 py-2  text-white hover:bg-green-600"
              onClick={() =>
                handleAction(
                  type,
                  selectedServices,
                  onClose,
                  path,
                  setLoading,
                  toast
                )
              }
            >
              Εξόφληση
            </button>
          )}
        </div>
      );

    case "Edit":
      return (
        <div>
          <h1 className="text-xl text-light-900">Επεξεργασία Υπηρεσιών</h1>
          {selectedServices.length === 0 ? (
            <p className="text-lg">Δεν υπάρχουν επιλεγμένες υπηρεσίες.</p>
          ) : (
            selectedServices.map((service, index) => (
              <div
                key={service._id}
                className="mb-4 flex flex-col gap-2 border-b border-gray-300 px-4 pb-4 text-lg"
              >
                <p>Υπηρεσία: {service.serviceType}</p>
                <p className="ml-4">Σημειώση: {service.notes || "Ν/Α"}</p>
                <p className="ml-4">
                  Ημερομηνία: {formatDate(new Date(service.date), "el")}
                </p>
                <p className="ml-4">Ποσό: {service.amount}€</p>
              </div>
            ))
          )}
          <button
            className="mt-4 w-full rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
            onClick={() =>
              handleAction(
                type,
                selectedServices,
                onClose,
                path,
                setLoading,
                toast
              )
            }
          >
            Επεξεργασία
          </button>
        </div>
      );

    case "Delete":
      return (
        <div>
          <h1 className="text-xl text-light-900">Διαγραφή Υπηρεσιών</h1>
          {selectedServices.length === 0 ? (
            <p className="text-lg">Δεν υπάρχουν επιλεγμένες υπηρεσίες.</p>
          ) : (
            selectedServices.map((service, index) => (
              <div
                key={service._id}
                className="mb-4 flex flex-col gap-2 border-b border-gray-300 px-4 pb-4 text-lg"
              >
                <p>Υπηρεσία: {service.serviceType}</p>
                <p className="ml-4">Σημειώση: {service.notes || "Ν/Α"}</p>
                <p className="ml-4">
                  Ημερομηνία: {formatDate(new Date(service.date), "el")}
                </p>
                <p className="ml-4">Ποσό: {service.amount}€</p>
              </div>
            ))
          )}
          <button
            className="mt-4 w-full rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
            onClick={() =>
              handleAction(
                type,
                selectedServices,
                onClose,
                path,
                setLoading,
                toast
              )
            }
          >
            Διαγραφή
          </button>
        </div>
      );

    case "Print":
      return (
        <div className="relative flex h-full w-full flex-col gap-4 px-2 py-4">
          <h1 className="text-xl text-light-900">Εκτύπωση Υπηρεσιών</h1>

          {/* This is the component to be printed */}
          <PrintableReceipt
            ref={printRef}
            selectedServices={selectedServices}
            client={client}
          />

          <button
            className="mt-4 w-full rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
            onClick={handlePrint}
          >
            Εκτύπωση
          </button>
        </div>
      );

    default:
      return null;
  }
};

// ServiceModal component that renders the modal based on selected services and type
const ServiceModal = (client: any) => {
  const { selectedServices, type, onClose, resetSelectedServices } =
    useServiceModal();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false); // Add loading state
  const printRef = useRef<HTMLDivElement | null>(null); // Create a ref for the print functionality

  // Handle outside clicks to close the modal
  const ref = useRef<HTMLDivElement | null>(null);
  useOutsideClick(ref, () => {
    resetSelectedServices();
    onClose();
  });

  // Path for the current route
  const path = usePathname();

  // Define the print handler using react-to-print hook
  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: "Print Services",
  });

  return (
    <motion.div
      ref={ref}
      className="absolute left-[20vw] top-[16.2vh] z-50 h-[60vh] w-full min-w-[60vw] max-w-md rounded-lg border border-purple-950 bg-light-700 p-6 shadow-lg dark:bg-dark-100"
      initial={{ scale: 0, opacity: 0 }} // Start from scaled down and invisible
      animate={{ scale: 1, opacity: 1 }} // Animate to full size and fully visible
      exit={{ scale: 0, opacity: 0 }} // Exit animation when closing
      transition={{ duration: 0.3 }} // Control the speed of the animation
    >
      {selectedServices
        ? renderContent(
            type,
            selectedServices,
            onClose,
            path,
            handlePrint,
            printRef,
            toast,
            loading,
            setLoading,
            client
          )
        : null}
    </motion.div>
  );
};

export default ServiceModal;
