import React, { useState } from "react";
import { useServiceModal } from "@/hooks/use-service-modal";
import { formatDate } from "@/lib/utils";
// Import the shadcn UI Calendar component.
// (Make sure this path matches your project setup)
import { Calendar } from "@/components/ui/calendar";
import { editNonBookingService } from "@/lib/actions/service.action";

const EditableServiceRow = ({
  service,
  nonEditableServiceTypes,
  handleUpdate,
}: any) => {
  const [isEditing, setIsEditing] = React.useState(false);
  // Initialize local state with the current service date and amount.
  const [newDate, setNewDate] = React.useState(new Date(service.date));
  const [newAmount, setNewAmount] = React.useState(service.amount);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Determine if the service is allowed to be edited.
  const isEditable = !nonEditableServiceTypes.includes(service.serviceType);
  const onSave = async () => {
    setLoading(true);
    setError(null);
    try {
      await handleUpdate(service._id, { date: newDate, amount: newAmount });
      setIsEditing(false);
    } catch (err) {
      console.error("Error updating service", err);
      setError("Απέτυχε η ενημέρωση της υπηρεσίας. Παρακαλώ δοκιμάστε ξανά.");
    } finally {
      setLoading(false);
    }
  };

  const onCancel = () => {
    setNewDate(new Date(service.date));
    setNewAmount(service.amount);
    setIsEditing(false);
  };
  return (
    <div
      key={service._id}
      className="mb-4 flex flex-col gap-4 border-b border-gray-300 px-4 pb-4 text-lg"
    >
      <p>Υπηρεσία: {service.serviceType}</p>
      <p className="ml-4">Σημειώση: {service.notes || "Ν/Α"}</p>

      {isEditing ? (
        <>
          {/* Date Picker */}
          <div className="flex flex-col gap-2">
            <label className="ml-4 font-medium">Ημερομηνία:</label>
            <Calendar
              mode="single"
              selected={newDate}
              // onSelect will only update state if a valid date is chosen
              onSelect={(date) => date && setNewDate(date)}
              className="ml-4"
            />
          </div>

          {/* New Amount Input */}
          <div className="flex flex-col gap-2">
            <label className="ml-4 font-medium">Νέο Ποσό:</label>
            <input
              type="number"
              value={newAmount}
              onChange={(e) => setNewAmount(Number(e.target.value))}
              className="ml-4 w-40 rounded border p-2"
            />
          </div>

          {/* Error Message */}
          {error && <p className="ml-4 text-red-500">{error}</p>}

          {/* Action Buttons */}
          <div className="ml-4 mt-2 flex gap-2">
            <button
              className="rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600"
              onClick={onSave}
              disabled={loading}
            >
              {loading ? "Αποθήκευση..." : "Αποθήκευση"}
            </button>
            <button
              className="rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
              onClick={onCancel}
              disabled={loading}
            >
              Ακύρωση
            </button>
          </div>
        </>
      ) : (
        <>
          <p className="ml-4">
            Ημερομηνία: {formatDate(new Date(service.date), "el")}
          </p>
          <p className="ml-4">Ποσό: {service.amount}€</p>
          <button
            className={`mt-2 flex w-40 items-center justify-center rounded bg-blue-500 px-4 py-2 tracking-widest text-white ${
              isEditable
                ? "bg-blue-500 hover:bg-blue-600"
                : "cursor-not-allowed bg-gray-400"
            }`}
            disabled={!isEditable}
            onClick={() => isEditable && setIsEditing(true)}
          >
            Επεξεργασία
          </button>
        </>
      )}
    </div>
  );
};

const EditServices = () => {
  const { selectedServices, setSelectedServices } = useServiceModal();

  // Service types that should not be edited.
  const nonEditableServiceTypes = [
    "Pet Taxi (Pick-Up)",
    "Pet Taxi (Drop-Off)",
    "ΔΙΑΜΟΝΗ",
  ];

  // Handle update logic for a service.
  // Replace this with your actual update logic (e.g., API call, state update)
  const handleUpdate = async (
    serviceId: string,
    updatedValues: { date: Date; amount: number }
  ) => {
    const updatedService = await editNonBookingService({
      serviceId,
      date: updatedValues.date,
      amount: updatedValues.amount,
    });
    setSelectedServices([updatedService], "");

    return updatedService;
    // Optionally update the local state (if your hook provides a setter)
  };

  return (
    <div>
      <h1 className="py-4 text-xl text-light-900">Επεξεργασία Υπηρεσιών</h1>
      {selectedServices.length === 0 ? (
        <p className="text-lg">Δεν υπάρχουν επιλεγμένες υπηρεσίες.</p>
      ) : (
        selectedServices.map((service) => (
          <EditableServiceRow
            key={service._id}
            service={service}
            nonEditableServiceTypes={nonEditableServiceTypes}
            handleUpdate={handleUpdate}
          />
        ))
      )}
    </div>
  );
};

export default EditServices;
