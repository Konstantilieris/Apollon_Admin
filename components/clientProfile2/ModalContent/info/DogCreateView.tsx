"use client";
import React, { useEffect } from "react";

import { usePathname } from "next/navigation";

import { IconLoader } from "@tabler/icons-react";
import { Button } from "@heroui/react";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { SingleDogValidation } from "@/lib/validation";

import { addClientDog } from "@/lib/actions/client.action";

import { useModalStore } from "@/hooks/client-profile-store";
import SingleDogForm from "@/components/form/SingleDogForm";
import { toast } from "sonner";

const DogCreateView = () => {
  const path = usePathname();

  const [mounted, setMounted] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const { modalData, closeModal } = useModalStore();

  const clientId = modalData?.clientId;

  const form = useForm<z.infer<typeof SingleDogValidation>>({
    resolver: zodResolver(SingleDogValidation),
    defaultValues: {
      name: "",
      gender: "Αρσενικό",
      birthdate: new Date().toISOString(),
      food: "",
      breed: "",
      behavior: "",
      microchip: "",
      sterilized: false,
    },
  });
  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) return null;
  const onSubmit = async (values: z.infer<typeof SingleDogValidation>) => {
    const dog = {
      name: values.name,
      gender: values.gender,
      birthdate: values.birthdate,
      food: values.food,
      breed: values.breed,
      behavior: values.behavior,
      microchip: values.microchip,
      sterilized: values.sterilized,
    };
    setLoading(true);
    try {
      const newClient = await addClientDog({
        clientId,
        dog,
        path,
      });
      if (newClient) {
        toast.success(`Το κατοικίδιο ${values.name} προστέθηκε επιτυχώς!`);
        closeModal();
      }
    } catch (error) {
      toast.error(`Η προσθήκη του κατοικίδιου ${values.name} απέτυχε!`);
    } finally {
      setLoading(false);
      form.reset();
    }
  };

  if (!clientId) return null;
  return (
    <div className="z-50 p-4">
      <div className="flex flex-col justify-around space-y-20 pt-10">
        <h1 className="text-center text-2xl tracking-widest ">
          Προσθήκη Σκύλου
        </h1>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="mt-10 flex w-full flex-col items-start justify-start "
            autoComplete="off"
          >
            <SingleDogForm form={form} />
          </form>
        </Form>
      </div>
      <div className="flex w-full justify-center">
        <Button
          onPress={() => form.handleSubmit(onSubmit)()}
          variant="bordered"
          color="secondary"
          className="uppercase tracking-widest"
          isDisabled={loading}
        >
          {loading ? (
            <IconLoader size={24} className="animate-spin" />
          ) : (
            "ΑΠΟΘΗΚΕΥΣΗ"
          )}
        </Button>
      </div>
    </div>
  );
};
export default DogCreateView;
