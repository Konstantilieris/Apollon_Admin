"use client";
import React, { useEffect } from "react";

import dynamic from "next/dynamic";
import { useServiceModal } from "@/hooks/use-service-modal";
const ServiceModal = dynamic(() => import("./PopoverActionService"), {
  ssr: false,
});
const ServiceModalProvider = ({ client }: any) => {
  const [mount, setMount] = React.useState(false);
  const { isOpen } = useServiceModal();
  useEffect(() => {
    setMount(true);
  }, []);
  if (!mount) return null;

  return <>{isOpen && <ServiceModal client={client} />}</>;
};

export default ServiceModalProvider;
