"use client";
import { useModalStore } from "@/hooks/client-profile-store";
import React from "react";
import EditBookingContent from "./EditBookingContent";
import EditService from "./EditOtherService/EditService";

const EditServiceView = () => {
  const { modalData } = useModalStore();

  if (!modalData) return null;
  if (modalData.service.bookingId) {
    return <EditBookingContent bookingId={modalData.service.bookingId} />;
  }

  return <EditService />;
};

export default EditServiceView;
