"use client";
import React from "react";

import Image from "next/image";
import { Button } from "@/components/ui/button";

const UncheckPayment = ({ clientId, item }: any) => {
  return (
    <Button
      onClick={() => {}}
      className="form-button2 ml-12 font-sans font-bold"
    >
      <Image
        src="/assets/icons/check.svg"
        alt="checked"
        width={20}
        height={20}
      />
    </Button>
  );
};

export default UncheckPayment;
