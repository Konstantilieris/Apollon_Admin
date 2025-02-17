"use client";
import React, { useState } from "react";
import { useServiceModal } from "@/hooks/use-service-modal";
import { formatDate } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar"; // Ensure correct path
import { editNonBookingService } from "@/lib/actions/service.action";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { usePathname, useRouter } from "next/navigation";
interface EditableServiceRowProps {
  service: any;
  nonEditableServiceTypes: string[];
  handleUpdate: (
    serviceId: string,
    updatedValues: { date: Date; amount: number }
  ) => Promise<any>;
}

const EditableServiceRow: React.FC<EditableServiceRowProps> = ({
  service,
  nonEditableServiceTypes,
  handleUpdate,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newDate, setNewDate] = useState(new Date(service.date));
  const [newAmount, setNewAmount] = useState(service.amount);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const isEditable = !nonEditableServiceTypes.includes(service.serviceType);

  const onSave = async () => {
    setLoading(true);
    setError(null);
    try {
      await handleUpdate(JSON.parse(JSON.stringify(service._id)), {
        date: newDate,
        amount: newAmount,
      });
      setIsEditing(false);
      router.refresh();
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
    <Card className="mb-4 bg-neutral-900 shadow-md">
      <CardHeader className="px-4 py-2">
        <CardTitle className="text-lg font-semibold text-white">
          Υπηρεσία: {service.serviceType}
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4 py-2 text-base text-gray-300">
        <p>Σημειώση: {service.notes || "Ν/Α"}</p>
        {isEditing ? (
          <div className="mt-4 space-y-4">
            {/* Date Picker */}
            <div>
              <label className="mb-1 block font-medium">Ημερομηνία:</label>
              <Calendar
                mode="single"
                selected={newDate}
                onSelect={(date) => date && setNewDate(date)}
                className="w-full"
              />
            </div>
            {/* Amount Input */}
            <div>
              <label className="mb-1 block font-medium">Νέο Ποσό:</label>
              <Input
                type="number"
                value={newAmount}
                onChange={(e) => setNewAmount(Number(e.target.value))}
                className="w-40"
              />
            </div>
            {error && <p className="text-red-500">{error}</p>}
            <div className="mt-2 flex gap-4">
              <Button onClick={onSave} disabled={loading} variant="ghost">
                {loading ? "Αποθήκευση..." : "Αποθήκευση"}
              </Button>
              <Button
                onClick={onCancel}
                disabled={loading}
                variant="destructive"
              >
                Ακύρωση
              </Button>
            </div>
          </div>
        ) : (
          <div className="mt-4">
            <p>Ημερομηνία: {formatDate(new Date(service.date), "el")}</p>
            <p>Ποσό: {service.amount}€</p>
            <div className="mt-2">
              <Button
                onClick={() => isEditable && setIsEditing(true)}
                disabled={!isEditable}
                variant={isEditable ? "outline" : "ghost"}
                className="w-40"
              >
                Επεξεργασία
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const EditServices: React.FC = () => {
  const { selectedServices, setSelectedServices, type } = useServiceModal();
  const path = usePathname();
  // Service types that should not be edited.
  const nonEditableServiceTypes = [
    "Pet Taxi (Pick-Up)",
    "Pet Taxi (Drop-Off)",
    "ΔΙΑΜΟΝΗ",
  ];

  // Handle update logic for a service.
  const handleUpdate = async (
    serviceId: string,
    updatedValues: { date: Date; amount: number }
  ) => {
    const updatedService = await editNonBookingService({
      serviceId,
      path,
      date: updatedValues.date,
      amount: updatedValues.amount,
    });
    setSelectedServices(
      selectedServices.map((s) => (s._id === serviceId ? updatedService : s)),
      type
    );
    return updatedService;
  };

  return (
    <div className="p-4 text-white md:p-8">
      <h1 className="mb-4 text-xl font-semibold">Επεξεργασία Υπηρεσιών</h1>
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
