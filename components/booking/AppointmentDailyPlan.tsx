import { getEventsByDate } from "@/lib/actions/event.action";
import { formatDateToTime, formatDateString2 } from "@/lib/utils";
import React from "react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
const AppointmentDailyPlan = async ({ date }: { date: Date }) => {
  console.log(date);
  const appointments = await getEventsByDate({ date });
  console.log(appointments);
  return (
    <section className="text-dark100_light900 mt-4 flex flex-col items-center gap-2 py-2  ">
      <h1> Ημερήσια Ραντεβού {formatDateString2(new Date(date))}</h1>
      {appointments.map((appointment: any) => (
        <HoverCard key={appointment._id}>
          <HoverCardTrigger className="cursor-pointer rounded-lg bg-light-850 p-2 text-dark-100 dark:bg-dark-100 dark:text-light-800">
            &bull;{formatDateToTime(new Date(appointment.StartTime))}
          </HoverCardTrigger>
          <HoverCardContent className="flex flex-col items-center justify-center gap-2 p-2 ">
            <h1 className="text-dark100_light900 font-semibold">
              {appointment.Subject}
            </h1>
            <p className="text-dark500_light500 font-normal">
              {appointment.Description}
            </p>
          </HoverCardContent>
        </HoverCard>
      ))}
    </section>
  );
};

export default AppointmentDailyPlan;
