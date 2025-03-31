// serviceFees.store.ts
import {
  updateClientServiceFee,
  updateClientServiceFeeBoarding,
} from "@/lib/actions/client.action";
import { create } from "zustand";

export interface ServiceFee {
  type: string; // e.g. "2 Dog Boarding"
  value: number; // e.g. 50
  dogCount?: number; // optional, only for boarding fees
}
interface ServiceFeesState {
  clientId: string | null; // store the clientId
  boardingFees: Record<number, number>;
  transportationFees: ServiceFee; // this is always one object with type "transportfee"
  otherServiceFees: ServiceFee[];

  // Initialize
  initializeFromClient: (client: any) => void;

  // Mutators
  setBoardingFee: (dogCount: number, newValue: number) => void;
  setTransportationFee: (type: string, newValue: number) => void;
  setOtherServiceFee: (type: string, newValue: number) => void;

  // Save action
  saveAllFees: () => Promise<void>;
}

export const useServiceFeesStore = create<ServiceFeesState>((set, get) => ({
  clientId: null,
  boardingFees: {},
  transportationFees: {
    type: "transportFee",
    value: 0,
  },
  otherServiceFees: [],

  initializeFromClient: (client) => {
    // 1) Keep the clientId so we know whom to update on the server
    const clientId = client?._id || null;
    console.log("Client ID:", clientId);
    console.log(client.serviceFees);
    const boardingFees: Record<number, number> = {};
    client?.serviceFees
      ?.filter((fee: any) => fee.type.toLowerCase().includes("bookingfee"))
      .forEach((fee: any) => {
        const dogCount = parseInt(fee.dogCount || "1"); // Default to 1 if dogCount is not provided
        boardingFees[dogCount] = fee.value;
      });
    console.log("Boarding Fees:", boardingFees);

    // 3) Transportation fees
    // this is always one object with type "transportfee"
    const transportationFees = (() => {
      const fee = client?.serviceFees?.find(
        (fee: any) => fee.type?.toLowerCase().includes("transportfee")
      );
      if (
        !fee ||
        fee.value === undefined ||
        fee.value === null ||
        isNaN(fee.value)
      ) {
        return { type: "transportFee", value: 0 };
      }
      return fee;
    })();
    // 4) Other fees (anything else not matching bookingFee or transportFee)
    const otherServiceFees =
      client?.serviceFees?.filter(
        (f: any) =>
          !f.type.toLowerCase().includes("bookingfee") &&
          !f.type.toLowerCase().includes("transportfee")
      ) || [];

    set({
      clientId,
      boardingFees,
      transportationFees,
      otherServiceFees,
    });
  },

  setBoardingFee: (dogCount, newValue) => {
    set((state) => ({
      boardingFees: {
        ...state.boardingFees,
        [dogCount]: newValue,
      },
    }));
  },

  setTransportationFee: (type, newValue) => {
    set((state) => ({
      transportationFees: {
        type: type || state.transportationFees?.type || "transportFee",
        value: newValue,
      },
    }));
  },

  setOtherServiceFee: (type, newValue) => {
    set((state) => ({
      otherServiceFees: state.otherServiceFees.map((fee) =>
        fee.type === type ? { ...fee, value: newValue } : fee
      ),
    }));
  },

  saveAllFees: async () => {
    const { clientId, boardingFees, transportationFees, otherServiceFees } =
      get();
    if (!clientId) {
      console.error("No clientId in store. Cannot update fees on the server.");
      return;
    }

    try {
      // We'll define a sample revalidation path, or pass it in from outside
      const pathToRevalidate = `/client/${clientId}`;

      // A) Boardings => each dogCount => call updateClientServiceFee
      const boardingPromises = Object.entries(boardingFees).map(
        async ([countAsString, price]) => {
          // e.g. "2 Dog Boarding"
          const dogCount = parseInt(countAsString, 10);
          const feeType = `bookingFee`;
          console.log(
            `Updating boarding fee for ${dogCount} dog(s) with price ${price}`
          );
          if (price === undefined || price === null || isNaN(price)) {
            console.warn(
              `Skipping boarding fee for ${dogCount} dog(s) due to missing price.`
            );
            return;
          }
          return updateClientServiceFeeBoarding({
            clientId,
            feeType,
            dogCount,
            price,
            path: pathToRevalidate,
          });
        }
      );

      // B) Transportation fees
      const transportationPromises = async () => {
        if (
          transportationFees?.value === undefined ||
          transportationFees?.value === null ||
          isNaN(transportationFees.value) ||
          transportationFees?.value === 0
        ) {
          console.warn("Skipping transportation fee due to missing price.");
          return;
        }

        return updateClientServiceFee({
          clientId,
          feeType: transportationFees?.type ?? "transportFee",
          price: transportationFees?.value,
          path: pathToRevalidate,
        });
      };

      // C) Other fees
      const otherPromises = otherServiceFees.map(async (fee) => {
        if (fee.value === undefined || fee.value === null || isNaN(fee.value)) {
          console.warn(`Skipping ${fee.type} fee due to missing price.`);
          return;
        }
        return updateClientServiceFee({
          clientId,
          feeType: fee.type,
          price: fee.value,
          path: pathToRevalidate,
        });
      });

      // Wait for all updates in parallel
      await Promise.all([
        ...boardingPromises,
        transportationPromises(),
        ...otherPromises,
      ]);

      console.log("All fees updated successfully");
    } catch (error) {
      console.error("Error saving fees:", error);
      throw error;
    }
  },
}));
