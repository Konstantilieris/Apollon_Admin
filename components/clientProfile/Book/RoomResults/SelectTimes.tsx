import React from "react";
import TimeSelect from "./TabRoomViews/TimeSelector";
import { useBookingStore } from "@/hooks/booking-store";
import ToggleWrapper from "./TransportToggle";

import CheckBoxDay from "./CheckBoxDay";

const SelectTimes = ({ setStages }: any) => {
  const {
    dateArrival,
    dateDeparture,
    setDateArrival,
    setDateDeparture,
    taxiArrival,
    setTaxiArrival,
    taxiDeparture,
    setTaxiDeparture,
  } = useBookingStore();
  return (
    <div className=" flex h-full w-full flex-col gap-4 p-4 ">
      <h1 className="text-2xl">
        {" "}
        Επέλεξε Ώρες Άφιξης, Αναχώρησης, και Υπηρεσία Μεταφοράς Κατοικιδίων
      </h1>
      <div className="flex w-full flex-row items-center gap-4">
        <TimeSelect
          placeHolderText={"Δίαλεξε Ώρα Άφιξης"}
          date={dateArrival}
          setDate={setDateArrival}
        />
        <ToggleWrapper
          taxi={taxiArrival}
          setTaxi={setTaxiArrival}
          label={{ on: "Παραλαβή", off: "Άφιξη" }}
        />
      </div>
      <div className="flex w-full flex-row items-center gap-4">
        <TimeSelect
          placeHolderText={"Δίαλεξε Ώρα Αναχώρησης "}
          date={dateDeparture}
          setDate={setDateDeparture}
        />
        <ToggleWrapper
          taxi={taxiDeparture}
          setTaxi={setTaxiDeparture}
          label={{ on: "Παράδοση", off: "Αναχώρηση" }}
        />
      </div>
      <CheckBoxDay />
      <button
        onClick={() => setStages(1)}
        className=" self-center rounded-lg border border-black bg-transparent px-6 py-2 font-bold text-black shadow-[0_0_0_3px_#000000_inset] transition duration-200 hover:-translate-y-1 dark:border-white dark:text-yellow-500"
      >
        ΚΑΤΑΧΩΡΗΣΗ
      </button>
    </div>
  );
};

export default SelectTimes;
