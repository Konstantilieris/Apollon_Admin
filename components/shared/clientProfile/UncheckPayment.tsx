"use client";
import React from "react";
import { Button } from "../../ui/button";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { uncheckedPayment } from "@/lib/actions/client.action";
import { useToast } from "../../ui/use-toast";
import { cn } from "@/lib/utils";

const UncheckPayment = ({ clientId, item }: any) => {
  const path = usePathname();
  const { toast } = useToast();
  const handleUncheck = async () => {
    try {
      await uncheckedPayment({
        clientId,
        serviceId: item._id,
        serviceType: item.serviceType,
        path,
      });
    } catch (error) {
      toast({
        className: cn(
          "bg-red-dark border-none text-white  font-sans text-center flex flex-center max-w-[300px] bottom-0 left-0 fixed  "
        ),
        title: "Αποτυχία ακύρωσης",
        description: `${error}`,
      });
      throw error;
    } finally {
      window.location.reload();
    }
  };
  return (
    <Button
      onClick={() => handleUncheck()}
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
