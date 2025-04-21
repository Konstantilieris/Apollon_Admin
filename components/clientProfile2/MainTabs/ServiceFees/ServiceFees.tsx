// ServiceFeesTab.tsx

import React, { useEffect } from "react";
import { Button } from "@heroui/react";
import { FinancialSummary } from "./FinancialSummary";
import { TransportationFees } from "./TransportationFee";
import { OtherServiceFees } from "./OtherServiceFees";
import { BoardingFees } from "./BoardingFees";
import { useServiceFeesStore } from "@/hooks/serviceFees.store";
import { toast } from "sonner";
import { Icon } from "@iconify/react/dist/iconify.js";

export function ServiceFeesTab({ client }: { client: any }) {
  const {
    // read from the store
    initializeFromClient,
    saveAllFees,
    boardingFees,
  } = useServiceFeesStore((state) => ({
    initializeFromClient: state.initializeFromClient,
    saveAllFees: state.saveAllFees,
    boardingFees: state.boardingFees,
    transportationFees: state.transportationFees,
    otherServiceFees: state.otherServiceFees,
  }));

  // 1. On mount, populate the store with the client data
  useEffect(() => {
    initializeFromClient(client);
  }, [client, initializeFromClient]);

  // 2. "Save" button that triggers store's save
  const handleSaveAll = async () => {
    // Example: you can do your own validations here if you want
    // For instance, check negative or missing fees for boarding
    const hasInvalidFees = Object.values(boardingFees).some((fee) => fee < 0);
    const hasMissingFees = Array.from(
      { length: client?.pets?.length || 0 },
      (_, i) => i + 1
    ).some((count) => boardingFees[count] === undefined);
    try {
      if (hasInvalidFees || hasMissingFees) {
        toast.error(
          "Παρακαλώ ελέγξτε τις τιμές των υπηρεσιών. Δεν επιτρέπονται αρνητικές τιμές ή κενές τιμές."
        );

        return;
      }

      // If all valid, persist changes
      await saveAllFees();
      toast.success("Οι τιμές αποθηκεύτηκαν επιτυχώς.");
    } catch (error) {
      console.error("Error saving fees:", error);
      toast.error("Αποτυχία αποθήκευσης τιμών.");
    }
  };

  return (
    <div className="max-h-[calc(100vh_-_360px)] space-y-6 overflow-y-auto px-4 py-6">
      <FinancialSummary client={client} />

      {/* 
        We no longer pass fees as props, 
        because TransportationFees, OtherServiceFees, and BoardingFees 
        will read from the Zustand store themselves.
      */}
      <TransportationFees />
      <OtherServiceFees />

      <BoardingFees dogCount={client?.dog?.length || 1} />

      <div className="mt-4 flex justify-end">
        <Button
          color="default"
          onPress={handleSaveAll}
          startContent={<Icon icon="lucide:save" />}
        >
          Αποθήκευση Αλλαγών
        </Button>
      </div>
    </div>
  );
}
