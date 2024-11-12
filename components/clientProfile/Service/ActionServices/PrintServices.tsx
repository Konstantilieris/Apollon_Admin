"use client";
import React, { useRef } from "react";
import PrintableReceipt from "./PrintableReceipt";
import { useReactToPrint } from "react-to-print";

const PrintServices = ({ client }: { client: any }) => {
  const printRef = useRef(null);
  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: "Print Services",
  });

  return (
    <div className="relative flex h-full w-full flex-col gap-4 px-2 py-4">
      <h1 className="text-xl text-light-900">Εκτύπωση Υπηρεσιών</h1>

      {/* This is the component to be printed */}
      <PrintableReceipt printRef={printRef} client={client} />

      <button
        className="mt-4 w-full rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
        onClick={() => {
          console.log("Print");
          handlePrint();
        }}
      >
        Εκτύπωση
      </button>
    </div>
  );
};

export default PrintServices;
