"use client";
import { ChargeForm } from "@/components/form/ChargeForm";
import { useToast } from "@/components/ui/use-toast";
import { useModalStore } from "@/hooks/client-profile-store";
import { getConstant } from "@/lib/actions/constant.action";
import { chargeClient, updateService } from "@/lib/actions/service.action";
import { Skeleton } from "@heroui/react";
import React, { useEffect } from "react";

const EditService = () => {
  const [services, setServices] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const { toast } = useToast();
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
        toast({
          title: "Service Added",
          description: "Service has been added successfully",
          className: "bg-green-500 text-white",
        });
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Error",
        description: "Error submitting form",
        className: "bg-red-500 text-white",
      });
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
