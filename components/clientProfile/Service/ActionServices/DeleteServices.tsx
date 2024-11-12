import { useServiceModal } from "@/hooks/use-service-modal";
import { formatDate } from "@/lib/utils";

import React from "react";

const DeleteServices = () => {
  const { selectedServices } = useServiceModal();

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
      <button className="mt-4 w-full rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600">
        Διαγραφή
      </button>
    </div>
  );
};

export default DeleteServices;
