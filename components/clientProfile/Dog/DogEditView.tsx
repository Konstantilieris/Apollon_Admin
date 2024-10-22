"use client";
import React from "react";
import { IconPawFilled } from "@tabler/icons-react";
import { motion } from "framer-motion";

import { Form } from "../../ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { usePathname } from "next/navigation";
import { useToast } from "../../ui/use-toast";
import { SingleDogValidation } from "@/lib/validation";

import SingleDogForm from "@/components/form/SingleDogForm";
import { updateClientDog } from "@/lib/actions/client.action";
interface DogEditViewProps {
  active: any;
  setActive: (active: any) => void;

  id: string;
  theRef: React.RefObject<HTMLDivElement>;
  setEdit: (edit: boolean) => void;
  clientId: string;
}
const DogEditView = ({
  active,
  setActive,

  id,
  theRef,
  setEdit,
  clientId,
}: DogEditViewProps) => {
  const { toast } = useToast();
  const path = usePathname();
  const form = useForm<z.infer<typeof SingleDogValidation>>({
    resolver: zodResolver(SingleDogValidation),
    defaultValues: {
      name: active.name ? active.name : "",
      gender: active.gender ? active.gender : "",
      birthdate: active.birthdate ? active.birthdate : "",
      food: active.food ? active.food : "",
      breed: active.breed ? active.breed : "",
      behavior: active.behavior ? active.behavior : "",
      microchip: active.microchip ? active.microchip : "",
      sterilized: active.sterilized ? active.sterilized : "Όχι",
    },
  });
  const onSubmit = async (values: z.infer<typeof SingleDogValidation>) => {
    const dog = {
      ...values,
      sterilized: values.sterilized === "Ναί",
    };

    try {
      const client = await updateClientDog({
        clientId,
        dogId: active._id,
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
    }
  };

  return (
    <motion.div
      layoutId={`card-${active.name}-${id}`}
      ref={theRef}
      className="no-scrollbar relative  z-40 flex h-full min-h-[80vh] w-full  min-w-[50vw] max-w-[500px]  flex-col overflow-auto border border-green-400 bg-white py-4 dark:bg-neutral-900 sm:rounded-3xl md:h-fit md:max-h-[90%]"
    >
      <motion.div
        layoutId={`image-${active._id}-${id}`}
        className="absolute right-2 top-2"
      >
        <IconPawFilled
          className="text-green-400"
          onClick={() => setEdit(false)}
        />
      </motion.div>

      <div>
        <h1 className=" ml-2"> ΕΠΕΞΕΡΓΑΣΙΑ</h1>
        <div className=" flex w-full flex-col items-start gap-4 px-6">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="mt-10 flex w-full flex-col items-start justify-start "
              autoComplete="off"
            >
              <SingleDogForm form={form} />
              <div className="flex w-full flex-row justify-end gap-2">
                <button
                  className="rounded bg-neutral-500 px-4 py-2   text-white"
                  onClick={() => {
                    setEdit(false);
                    setActive(null);
                  }}
                >
                  ΑΚΥΡΩΣΗ
                </button>
                <button
                  type="submit"
                  className="rounded bg-green-500 px-4 py-2  text-white"
                >
                  ΥΠΟΒΟΛΗ
                </button>
              </div>
            </form>
          </Form>
        </div>

        <div className="relative px-4 pt-4">
          <motion.div
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex h-40 flex-col items-start gap-4 overflow-auto pb-10 text-xs text-neutral-600 [-ms-overflow-style:none] [-webkit-overflow-scrolling:touch] [mask:linear-gradient(to_bottom,white,white,transparent)] [scrollbar-width:none] dark:text-neutral-400 md:h-fit md:text-sm lg:text-base"
          >
            {typeof active.content === "function"
              ? active.content()
              : active.content}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default DogEditView;
