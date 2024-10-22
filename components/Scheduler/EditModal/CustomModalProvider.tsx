"use client";

import React, { useEffect, useState } from "react";
import { CustomModal } from "./CustomModal";
import useCalendarModal from "@/hooks/use-calendar-modal";

const CustomModalProvider = () => {
  const [mount, setMount] = useState(false);
  const { selectedEvent } = useCalendarModal();

  useEffect(() => {
    setMount(true);
  }, []);
  if (!mount) return null;
  if (!selectedEvent) return null;
  return <CustomModal />;
};

export default CustomModalProvider;
