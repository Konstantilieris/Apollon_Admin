import { useCallback, useRef, useState } from "react";
import moment from "moment";
import { getEventsWithPairs } from "@/lib/actions/event.action";
import { IEvent } from "@/database/models/event.model";
import isEqual from "fast-deep-equal";

export interface CalendarEvent extends IEvent {
  __shadow?: boolean;
  _id?: string; // for Mongo ObjectId returned as string
}

interface OccupancyMap {
  [date: string]: {
    [roomId: string]: Set<string>; // ← set of booking keys occupying that room
  };
}

export default function useSchedulerData() {
  /** ------------------------------------------------------------------ state */
  const [appointments, setAppointments] = useState<CalendarEvent[]>([]);
  const [roomOccupancyMap, setRoomOccupancyMap] = useState<OccupancyMap>({});
  const previousRangeRef = useRef<{ start: string; end: string } | null>(null);

  /** ------------------------------------------------ helper: build occupancy */
  const buildRoomOccupancyMap = useCallback(
    (events: CalendarEvent[]): OccupancyMap => {
      const map: OccupancyMap = {};

      /* ① group all slices by bookingId (or fallback _id) */
      const byBooking: Record<string, CalendarEvent[]> = {};
      events.forEach((ev) => {
        const key = (ev.bookingId ?? ev._id)?.toString();
        if (!key) return;
        (byBooking[key] ??= []).push(ev);
      });

      /* ② for every booking, mark the whole span busy for each room it uses */
      Object.entries(byBooking).forEach(([bookingKey, list]) => {
        const spanStart = moment.min(list.map((e) => moment(e.StartTime)));
        const spanEnd = moment.max(list.map((e) => moment(e.EndTime)));

        const roomIds = list
          .flatMap((e) => e.dogsData ?? [])
          .map((d) => d.roomId?.toString())
          .filter(Boolean) as string[];

        const cur = spanStart.clone();
        while (cur.isSameOrBefore(spanEnd, "day")) {
          const day = cur.format("YYYY-MM-DD");
          map[day] ??= {};
          roomIds.forEach((rid) => {
            map[day][rid] ??= new Set();
            map[day][rid].add(bookingKey);
          });
          cur.add(1, "day");
        }
      });

      return map;
    },
    []
  );

  /** ------------------------------------------------------------- loadWindow */
  const loadWindow = useCallback(
    async (start?: Date, end?: Date) => {
      if (!start || !end) return;

      const startISO = moment(start).startOf("day").toISOString();
      const endISO = moment(end).endOf("day").toISOString();

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

  /** -------------------------------------------- check collision on the fly */
  const checkRoomConflictFrontend = useCallback(
    (
      date: Date,
      dragged: CalendarEvent,
      mate: CalendarEvent | null
    ): boolean => {
      const bookingKey = (dragged.bookingId ?? dragged._id)?.toString();
      const roomIds = (dragged.dogsData ?? []).map((d) => d.roomId.toString());

      const from = moment(dragged.isArrival ? date : mate?.StartTime);
      const to = moment(!dragged.isArrival ? date : mate?.StartTime);

      while (from.isSameOrBefore(to, "day")) {
        const day = from.format("YYYY-MM-DD");
        const occ = roomOccupancyMap[day] ?? {};

        if (
          roomIds.some((rid) => {
            const bookings = occ[rid]; // Set<string> | undefined
            if (!bookings) return false; // room free
            if (!bookingKey) return false;
            if (bookings.size === 1 && bookings.has(bookingKey)) return false;
            return !bookings.has(bookingKey); // true = collision
          })
        ) {
          return true;
        }
        from.add(1, "day");
      }
      return false;
    },
    [roomOccupancyMap]
  );

  /** ---------------------------------------------------------------- return */
  return {
    appointments,
    setAppointments,
    roomOccupancyMap,
    setRoomOccupancyMap,
    loadWindow,
    checkRoomConflictFrontend,
  };
}
