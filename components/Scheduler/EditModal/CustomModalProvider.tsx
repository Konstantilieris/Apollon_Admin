"use client";

import React, { useEffect, useState } from "react";
import { CustomModal } from "./CustomModal";
import useCalendarModal from "@/hooks/use-calendar-modal";
import { usePathname } from "next/navigation";

const CustomModalProvider = () => {
  const [mount, setMount] = useState(false);
  const { selectedEvent, onClose } = useCalendarModal();
  const pathname = usePathname();
  useEffect(() => {
    setMount(true);
  }, []);
  // close modal when pathname changes
  useEffect(() => {
    onClose();
  }, [pathname]);
  if (!mount) return null;
  if (!selectedEvent) return null;
  return <CustomModal />;
};

export default CustomModalProvider;
