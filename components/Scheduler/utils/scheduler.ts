import React from "react";

import { getEventsWithPairs } from "@/lib/actions/event.action";
import { IEvent } from "@/database/models/event.model";

interface CalendarEvent extends IEvent {
  __shadow?: boolean;
}

export async function findMateForEvent(
  event: CalendarEvent,
  currentAppointments: CalendarEvent[],
  setAppointments: React.Dispatch<React.SetStateAction<CalendarEvent[]>>
): Promise<CalendarEvent | undefined> {
  // a) try local state first
  let mate = currentAppointments.find(
    (e) =>
      e.bookingId?.toString() === event.bookingId?.toString() &&
      e.isArrival !== event.isArrival
  );
  if (mate) return mate;

  // b) fallback fetch – tiny window around event
  const extraRaw = await getEventsWithPairs(
    event.StartTime.toISOString(),
    event.EndTime.toISOString()
  );
  const extra: CalendarEvent[] =
    typeof extraRaw === "string" ? JSON.parse(extraRaw) : extraRaw;

  mate = extra.find(
    (e) =>
      e.bookingId?.toString() === event.bookingId?.toString() &&
      e.isArrival !== event.isArrival
  );

  if (mate) {
    setAppointments((prev) => [...prev, mate!]);
  }

  return mate;
}
