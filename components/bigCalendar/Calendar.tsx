"use client";

import React, { useEffect } from "react";

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
  const [size, setSize] = React.useState({ width: 1600, height: 770 });
  useEffect(() => {
    const updatePageSize = () => {
      if (window.matchMedia("(min-width: 2000px)").matches) {
        setSize({ width: 2200, height: 1100 });
      } else if (window.matchMedia("(min-width: 1024px)").matches) {
        setSize({ width: 1600, height: 770 });
      } else {
        setSize({ width: 1200, height: 600 });
      }
    };

    updatePageSize(); // Initial update

    const resizeHandler = () => {
      updatePageSize();
    };

    window.addEventListener("resize", resizeHandler);

    return () => {
      window.removeEventListener("resize", resizeHandler);
    };
  }, []);
  const eventSettings = { dataSource: appointments };
  return (
    <ScheduleComponent
      className="w-full rounded-lg "
      height={size.height}
      width={size.width}
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
