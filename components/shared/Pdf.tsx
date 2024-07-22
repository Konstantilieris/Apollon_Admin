import React from "react";

import { Button } from "../ui/button";

const Pdf = () => {
  // eslint-disable-next-line new-cap
  const printPDF = (pdfPath: string) => {
    // Open a new window or tab with the PDF
    const pdfWindow = window.open(pdfPath, "_blank");

    // Wait for the PDF to load
    if (pdfWindow) {
      pdfWindow.onload = function () {
        // Print the PDF
        pdfWindow.print();
      };
    }
  };
  return (
    <div>
      <Button
        onClick={() => printPDF("/assets/form.pdf")}
        className="btn border-2 border-purple-500 font-sans font-bold hover:animate-pulse"
      >
        ΕΚΤΥΠΩΣΗ PDF
      </Button>
    </div>
  );
};

export default Pdf;
