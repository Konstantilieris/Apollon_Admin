"use client";
import React, { useEffect } from "react";

import dynamic from "next/dynamic";
import { useServiceModal } from "@/hooks/use-service-modal";
import useServiceClientStore from "@/hooks/service-clientId";
import { getClientByIdForProfile } from "@/lib/actions/client.action";
const ServiceModal = dynamic(
  () => import("../clientProfile/Service/PopoverActionService"),
  {
    ssr: false,
  }
);
const ServiceModalProvider = () => {
  const [mount, setMount] = React.useState(false);
  const { isOpen } = useServiceModal();
  const { clientId, resetStore } = useServiceClientStore();
  const [client, setClient] = React.useState(null);
  useEffect(() => {
    setMount(true);
  }, []);
  useEffect(() => {
    const fetchClient = async () => {
      const res = await getClientByIdForProfile(clientId);
      setClient(res);
    };
    fetchClient();
  }, [clientId]);
  // if closed reset clientId
  useEffect(() => {
    if (!isOpen) {
      resetStore();
      setClient(null);
    }
  }, [isOpen]);

  if (!mount) return null;

  return <>{isOpen && client && <ServiceModal client={client} />}</>;
};

export default ServiceModalProvider;
