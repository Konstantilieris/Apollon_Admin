import { useState, useEffect } from "react";
import { getAllAvailableRooms } from "@/lib/actions/booking.action"; // adjust the import as needed

// Define the generic RangeValue type

// Define the expected response type from getAllAvailableRooms
interface AvailableRoomsResponse {
  emptyRooms: any[]; // Adjust this type according to your data structure
  freeCapacityPercentage: string;
}

// Define the return type for the hook
interface UseAvailableRoomsReturn {
  rooms: any[];
  freeCapacityPercentage: number | null;
  isLoading: boolean;
  error: Error | null;
}

export const useAvailableRooms = (dateRange: {
  start: Date | null | undefined;
  end: Date | null | undefined;
}): UseAvailableRoomsReturn => {
  const [rooms, setRooms] = useState<any[]>([]);
  const [freeCapacityPercentage, setFreeCapacityPercentage] = useState<
    number | null
  >(null);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Ensure both dates are set
    if (!dateRange || !dateRange.start || !dateRange.end) return;

    const fetchAvailableRooms = async () => {
      setLoading(true);
      setError(null);
      try {
        const response: AvailableRoomsResponse = await getAllAvailableRooms({
          dateArrival: new Date(dateRange.start as any),
          dateDeparture: new Date(dateRange.end as any),
        });
        setRooms(response.emptyRooms);
        setFreeCapacityPercentage(parseFloat(response.freeCapacityPercentage));
      } catch (err: any) {
        console.error(err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAvailableRooms();
  }, [dateRange]);

  return { rooms, freeCapacityPercentage, isLoading, error };
};

export default useAvailableRooms;
