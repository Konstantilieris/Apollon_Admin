"use client";
import React, { useEffect } from "react";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
} from "../../ui/animated-modal";
import { usePathname } from "next/navigation";
import { useToast } from "../../ui/use-toast";
import { IconLoader } from "@tabler/icons-react";
import { Button } from "../../ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { SingleDogValidation } from "@/lib/validation";

import { Form } from "../../ui/form";
import { addClientDog } from "@/lib/actions/client.action";
import SingleDogForm from "../../form/SingleDogForm";

const CreateDogModal = ({
  isOpen,
  setOpen,
  clientId,
}: {
  isOpen: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  clientId: string;
}) => {
  const path = usePathname();
  const { toast } = useToast();
  const [mounted, setMounted] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const form = useForm<z.infer<typeof SingleDogValidation>>({
    resolver: zodResolver(SingleDogValidation),
    defaultValues: {
      name: "",
      gender: "",
      birthdate: new Date(),
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
        toast({
          className:
            "bg-celtic-green border-none text-white   text-center flex flex-center max-w-[300px] bottom-0 left-0 fixed  ",
          title: "Επιτυχία",
          description: "Ο σκύλος καταχωρήθηκε",
        });
        setOpen(false);
      }
    } catch (error) {
      toast({
        className:
          "bg-red-dark border-none text-white   text-center flex flex-center max-w-[300px] bottom-0 left-0 fixed  ",
        title: "Αποτυχία δημιουργίας",
        description: `${error}`,
      });
    } finally {
      setLoading(false);
      form.reset();
    }
  };
  return (
    <Modal>
      <ModalBody
        isOpen={isOpen}
        setOpen={setOpen}
        className="custom-scrollbar overflow-y-scroll"
      >
        <ModalContent className="flex flex-col justify-around">
          <h1 className="text-start text-2xl ">Προσθήκη Σκύλου</h1>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="mt-10 flex w-full flex-col items-start justify-start "
              autoComplete="off"
            >
              <SingleDogForm form={form} />
            </form>
          </Form>
        </ModalContent>
        <ModalFooter className="gap-2 bg-purple-400">
          <Button
            onClick={() => form.handleSubmit(onSubmit)()}
            className="border border-dark-100 bg-purple-800  font-semibold transition-colors hover:scale-105 hover:bg-purple-900 "
            variant={null}
          >
            {loading ? (
              <IconLoader size={24} className="animate-spin" />
            ) : (
              "ΑΠΟΘΗΚΕΥΣΗ"
            )}
          </Button>
        </ModalFooter>
      </ModalBody>
    </Modal>
  );
};
export default CreateDogModal;
