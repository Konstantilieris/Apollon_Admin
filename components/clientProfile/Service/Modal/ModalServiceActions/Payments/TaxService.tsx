"use client";
import React, { useState } from "react";
import { useServiceModal } from "@/hooks/use-service-modal";
import { formatDate, cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import { usePathname } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { IconLoader } from "@tabler/icons-react";
import { updateTaxForSelectedServices } from "@/lib/actions/service.action";

const TaxService: React.FC = () => {
  const { selectedServices } = useServiceModal();
  const path = usePathname();
  const { toast } = useToast();
  const [globalTaxRate, setGlobalTaxRate] = useState<number>(24); // default value
  const [loading, setLoading] = useState(false);

  if (selectedServices.length === 0) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center p-8 text-white">
        <h1 className="text-2xl font-semibold">Ενημέρωση Φόρου</h1>
        <p className="mt-4 text-lg">Δεν υπάρχουν επιλεγμένες υπηρεσίες.</p>
      </div>
    );
  }

  const handleUpdateTax = async () => {
    setLoading(true);
    const selectedServiceIds = selectedServices.map((service) => service._id);
    try {
      const res = await updateTaxForSelectedServices({
        selectedServiceIds,
        taxRate: globalTaxRate,
        path,
      });
      if (res.success) {
        toast({
          title: "Επιτυχία",
          description: "Ο φόρος ενημερώθηκε επιτυχώς.",
          className: cn(
            "bg-celtic-green border-none text-white text-center flex items-center max-w-[300px] fixed bottom-0 left-0 font-sans"
          ),
        });
      } else {
        toast({
          title: "Σφάλμα",
          description: res.message || "Απέτυχε η ενημέρωση του φόρου.",
          className: cn(
            "bg-red-500 border-none text-white text-center flex items-center max-w-[300px] fixed bottom-0 left-0 font-sans"
          ),
        });
      }
    } catch (error) {
      console.error("Error updating tax:", error);
      toast({
        title: "Σφάλμα",
        description: "Παρουσιάστηκε σφάλμα κατά την ενημέρωση του φόρου.",
        className: cn(
          "bg-red-500 border-none text-white text-center flex items-center max-w-[300px] fixed bottom-0 left-0 font-sans"
        ),
      });
    } finally {
      setLoading(false);
      // Optionally trigger a client-side refresh via router.refresh() if needed.
    }
  };

  return (
    <div className="flex h-full w-full flex-col items-center gap-8 p-4 text-white md:p-8">
      <h1 className="self-start text-2xl font-semibold">Ενημέρωση Φόρου</h1>

      {/* Global Tax Rate Input */}
      <div className="flex w-full flex-col items-center gap-4">
        <label className="text-lg font-medium">Ποσοστό φόρου (%):</label>
        <Input
          type="number"
          value={globalTaxRate}
          onChange={(e) => setGlobalTaxRate(Number(e.target.value))}
          className="w-40 rounded border p-2 dark:border-neutral-600 dark:bg-neutral-800"
          min="0"
          max="100"
        />
      </div>

      {/* List of Selected Services */}
      <ScrollArea className="w-full" style={{ maxHeight: "60vh" }}>
        <div className="space-y-4">
          {selectedServices.map((service) => (
            <Card key={service._id} className="bg-neutral-800 shadow-md">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">
                  {service.serviceType}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm">
                <p>
                  <strong>Ημερομηνία:</strong>{" "}
                  {formatDate(new Date(service.date), "el")}
                </p>
                <p>
                  <strong>Ποσό:</strong> {service.amount}€
                </p>
                <p>
                  <strong>Τρέχων Φόρος:</strong>{" "}
                  {service.taxRate !== undefined
                    ? `${service.taxRate}%`
                    : "N/A"}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>

      {/* Update Button */}
      <Button
        onClick={handleUpdateTax}
        disabled={loading}
        className="w-full max-w-[20vw] bg-blue-500 hover:bg-blue-600"
      >
        {loading ? (
          <IconLoader className="animate-spin" size={24} />
        ) : (
          "Ενημέρωση Φόρου"
        )}
      </Button>
    </div>
  );
};

export default TaxService;
