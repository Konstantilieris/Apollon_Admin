"use client";

import React from "react";

import {
  Week,
  Day,
  Month,
  ScheduleComponent,
  ViewsDirective,
  ViewDirective,
  Inject,
} from "@syncfusion/ej2-react-schedule";
import { registerLicense } from "@syncfusion/ej2-base";

registerLicense(
  "Ngo9BigBOggjHTQxAR8/V1NAaF1cXmhIfEx1RHxQdld5ZFRHallYTnNWUj0eQnxTdEFjW31fcXVRR2JcUUdxXg=="
);

const Scheduler = ({ appointments }: any) => {
  const eventSettings = { dataSource: appointments };
  return (
    <ScheduleComponent
      height={900}
      className=" w-full"
      eventSettings={eventSettings}
      selectedDate={new Date()}
      readonly={true}
      quickInfoTemplates={{ footer: "Admin" }}
    >
      <ViewsDirective>
        <ViewDirective option="Day" />
        <ViewDirective option="Week" />
        <ViewDirective option="Month" />
      </ViewsDirective>
      <Inject services={[Day, Week, Month]} />
    </ScheduleComponent>
  );
};

export default Scheduler;
