"use client";
import { ChargeForm } from "@/components/form/ChargeForm";

import { useModalStore } from "@/hooks/client-profile-store";
import { getConstant } from "@/lib/actions/constant.action";
import { chargeClient, updateService } from "@/lib/actions/service.action";
import { Skeleton } from "@heroui/react";
import React, { useEffect } from "react";
import { toast } from "sonner";
const EditService = () => {
  const [services, setServices] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  const { modalData, closeModal } = useModalStore();
  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true);
      try {
        const data = await getConstant("Services");
        setServices(data);
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    };
    fetchServices();
  }, []);

  const handleSubmit = async (data: any) => {
    console.log("Form submitted with data:", data);
    setLoading(true);
    try {
      const res = await updateService({
        serviceId: modalData?.service._id,
        ...data,
      });
      if (res) {
        toast.success("Service updated successfully!");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to update service. Please try again.");
    } finally {
      setLoading(false);
      closeModal();
    }
  };

  return (
    <Skeleton isLoaded={!loading || !modalData?.client}>
      <ChargeForm
        client={modalData?.client}
        services={services}
        onSubmit={handleSubmit}
        initialData={modalData?.service}
      />
    </Skeleton>
  );
};

export default EditService;
