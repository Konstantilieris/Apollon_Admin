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

const registerKey = process.env.NEXT_PUBLIC_REGISTER_KEY || ""; // Set a default value if the key is undefined
registerLicense(registerKey);

const Scheduler = ({ appointments }: any) => {
  const eventSettings = { dataSource: appointments };
  return (
    <ScheduleComponent
      height={900}
      className=" w-full"
      readonly={true}
      eventSettings={eventSettings}
      selectedDate={new Date()}
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
