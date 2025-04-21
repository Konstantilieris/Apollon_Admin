"use client";
import { ChargeForm } from "@/components/form/ChargeForm";
import { toast } from "sonner";
import { useModalStore } from "@/hooks/client-profile-store";
import { getConstant } from "@/lib/actions/constant.action";
import { chargeClient } from "@/lib/actions/service.action";
import { Skeleton } from "@heroui/react";
import React, { useEffect } from "react";

const CreateServiceView = () => {
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
      const response = await chargeClient({
        clientId: modalData.client._id,
        serviceType: data.serviceType,
        amount: data.amount,
        date: data.date,
        notes: data.notes,
      });
      if (response) {
        toast.success("Service charged successfully!");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to charge service. Please try again.");
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
      />
    </Skeleton>
  );
};

export default CreateServiceView;
