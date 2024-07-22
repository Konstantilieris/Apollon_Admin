"use client";
import React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import Image from "next/image";
const AlertBehavior = ({ status, client }: { status: any; client: any }) => {
  const [open, setOpen] = React.useState(!!status);
  return (
    open && (
      <Alert className="relative z-50 border-red-800 font-sans text-xl font-semibold text-red-800">
        <Image
          src="/assets/icons/close2.svg"
          width={20}
          height={20}
          alt="x"
          className="absolute right-2 top-2 animate-pulse"
          onClick={() => setOpen(false)}
        />
        <ExclamationTriangleIcon className="h-5 w-5" />
        <AlertTitle>ΑΝΕΠΙΘΥΜΗΤΟΣ</AlertTitle>
        <AlertDescription className="flex w-full flex-row justify-center font-semibold">
          {" "}
          Ο ΣΚΥΛΟΣ ΜΕ ΟΝΟΜΑ {status?.name} ΤΟΥ ΠΕΛΑΤΗ {client?.name} ΕΙΝΑΙ
          ΑΝΕΠΙΘΥΜΗΤΟΣ
        </AlertDescription>
      </Alert>
    )
  );
};

export default AlertBehavior;
