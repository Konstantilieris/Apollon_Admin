"use client";
import React from "react";

import { Form } from "../../../ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { usePathname, useRouter } from "next/navigation";
import { useToast } from "../../../ui/use-toast";
import { SingleDogValidation } from "@/lib/validation";

import SingleDogForm from "@/components/form/SingleDogForm";
import { updateClientDog } from "@/lib/actions/client.action";
import { useModalStore } from "@/hooks/client-profile-store";
import { Button } from "@heroui/react";

const DogEditView = () => {
  const { toast } = useToast();
  const path = usePathname();
  const { modalData, closeModal } = useModalStore();
  const router = useRouter();

  const form = useForm<z.infer<typeof SingleDogValidation>>({
    resolver: zodResolver(SingleDogValidation),
    defaultValues: {
      name: modalData?.dog?.name ? modalData?.dog?.name : "",
      gender: modalData?.dog?.gender ? modalData?.dog?.gender : "",
      birthdate: modalData?.dog?.birthdate
        ? modalData?.dog?.birthdate
        : undefined,
      food: modalData?.dog?.food ? modalData?.dog?.food : "",
      breed: modalData?.dog?.breed ? modalData?.dog?.breed : "",
      behavior: modalData?.dog?.behavior ? modalData?.dog?.behavior : "",
      microchip: modalData?.dog?.microchip ? modalData?.dog?.microchip : "",
      sterilized: modalData?.dog?.sterilized ?? false,
    },
  });
  const onSubmit = async (values: z.infer<typeof SingleDogValidation>) => {
    const dog = {
      ...values,
    };

    try {
      const client = await updateClientDog({
        clientId: modalData?.clientId,
        dogId: modalData?.dog._id,
        dog,
        path,
      });
      if (client) {
        toast({
          className:
            "bg-celtic-green border-none text-white   text-center flex flex-center max-w-[300px] bottom-0 left-0 fixed  ",
          title: "Επιτυχία",
          description: "Επιτυχής ενημέρωση",
        });
      }
    } catch (error) {
      toast({
        className:
          "bg-red-500 border-none text-white   text-center flex flex-center max-w-[300px] bottom-0 left-0 fixed  ",
        title: "Σφάλμα",
        description: "Κάτι πήγε στραβά",
      });
    } finally {
      closeModal();
      router.refresh();
    }
  };

  return (
    <div className=" flex h-full w-full flex-col items-start gap-4 px-6">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className=" flex h-full w-full flex-col items-center justify-center gap-8"
          autoComplete="off"
        >
          <h1 className=" mb-8 ml-2 text-center text-lg tracking-widest ">
            {" "}
            ΕΠΕΞΕΡΓΑΣΙΑ ΣΚΥΛΟΥ
          </h1>
          <SingleDogForm form={form} />
          <div className="flex w-full flex-row justify-center gap-2">
            <Button
              className="rounded  px-4 py-2   text-white"
              color="danger"
              variant="bordered"
              onPress={() => {
                closeModal();
              }}
            >
              ΑΚΥΡΩΣΗ
            </Button>
            <Button
              type="submit"
              color="success"
              variant="bordered"
              className="rounded px-4 py-2  text-white"
            >
              ΥΠΟΒΟΛΗ
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default DogEditView;
