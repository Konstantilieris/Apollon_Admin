import { useCallback, useRef, useState } from "react";
import moment from "moment";
import { getEventsWithPairs } from "@/lib/actions/event.action";
import { IEvent } from "@/database/models/event.model";
import isEqual from "fast-deep-equal";
interface CalendarEvent extends IEvent {
  __shadow?: boolean;
}

export default function useSchedulerData() {
  const [appointments, setAppointments] = useState<CalendarEvent[]>([]);
  const [roomOccupancyMap, setRoomOccupancyMap] = useState<
    Record<string, Set<string>>
  >({});
  const previousRangeRef = useRef<{ start: string; end: string } | null>(null);
  const buildRoomOccupancyMap = useCallback((bookings: any[]) => {
    const map: Record<string, Set<string>> = {};
    bookings.forEach((booking) => {
      const from = moment(booking.fromDate || booking.StartTime);
      const to = moment(booking.toDate || booking.EndTime);
      const dogs = booking.dogs || booking.dogsData || [];
      while (from.isSameOrBefore(to, "day")) {
        const key = from.format("YYYY-MM-DD");
        if (!map[key]) map[key] = new Set();
        dogs.forEach((dog: any) => {
          if (dog.roomId) map[key].add(dog.roomId.toString());
        });
        from.add(1, "day");
      }
    });
    return map;
  }, []);

  // Make sure to install lodash.isequal if needed

  const loadWindow = useCallback(
    async (start?: Date, end?: Date) => {
      if (!start || !end) return;

      const startISO = start.toISOString();
      const endISO = end.toISOString();

      const viewStart = moment(start).startOf("day");
      const viewEnd = moment(end).endOf("day");

      const api = await getEventsWithPairs(startISO, endISO);

      const decorated = api.map((e) => ({
        ...e,
        __shadow:
          moment(e.StartTime).isAfter(viewEnd) ||
          moment(e.EndTime).isBefore(viewStart),
      }));

      const newOccupancy = buildRoomOccupancyMap(decorated);

      // Only update state if data has changed
      const shouldUpdate =
        !isEqual(previousRangeRef.current, { start: startISO, end: endISO }) ||
        !isEqual(appointments, decorated);

      if (shouldUpdate) {
        setAppointments(decorated);
        setRoomOccupancyMap(newOccupancy);
      }

      previousRangeRef.current = { start: startISO, end: endISO };
    },
    [appointments, buildRoomOccupancyMap]
  );

  const checkRoomConflictFrontend = useCallback(
    (date: Date, draggedEvent: any, pairedEvent: any): boolean => {
      const roomIds = draggedEvent.dogsData.map((dog: any) =>
        dog.roomId.toString()
      );
      const isArrival = draggedEvent.isArrival;
      const from = moment(isArrival ? date : pairedEvent?.StartTime);
      const to = moment(!isArrival ? date : pairedEvent?.StartTime);
      while (from.isSameOrBefore(to, "day")) {
        const dayStr = from.format("YYYY-MM-DD");
        const occupied = roomOccupancyMap[dayStr] || new Set();
        if (roomIds.some((id: string) => occupied.has(id))) return true;
        from.add(1, "day");
      }
      return false;
    },
    [roomOccupancyMap]
  );

  return {
    appointments,
    setAppointments,
    roomOccupancyMap,
    setRoomOccupancyMap,
    loadWindow,
    checkRoomConflictFrontend,
  };
}
