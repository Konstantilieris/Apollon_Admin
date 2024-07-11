"use client";
import { DogValidation } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Form } from "../ui/form";
import DogField from "./DogField";
import { Loader } from "lucide-react";
import { CreateClient } from "@/lib/actions/client.action";
import { cn } from "@/lib/utils";
import { useToast } from "../ui/use-toast";
import { useRouter } from "next/navigation";
const DogForm = ({ number, setStage, client }: any) => {
  const [isCreating, setIsCreating] = React.useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const form = useForm<z.infer<typeof DogValidation>>({
    resolver: zodResolver(DogValidation),
    defaultValues: {
      dogs: Array.from({ length: number }, () => ({
        name: "",
        gender: "",
        birthdate: new Date(),
        food: "",
        breed: "",
        behavior: "",
        microchip: "",
      })),
    },
  });

  const renderDogFields = () => {
    const dogFields = [];
    for (let i = 0; i < number; i++) {
      dogFields.push(<DogField key={i} form={form} index={i} />);
    }
    return dogFields;
  };
  const onSubmit = async (values: z.infer<typeof DogValidation>) => {
    setIsCreating(true);
    try {
      const newClient = await CreateClient({
        clientData: { ...client },
        dogs: values.dogs,
      });
      if (newClient) {
        const client = JSON.parse(newClient);
        toast({
          className: cn(
            "bg-celtic-green border-none text-white  font-noto_sans text-center flex flex-center max-w-[300px] bottom-0 left-0 fixed  "
          ),
          title: "Επιτυχία",
          description: "Ο πελάτης καταχωρήθηκε",
        });
        router.push(`/form/${client?._id}`);
      }
    } catch (error) {
      toast({
        className: cn(
          "bg-red-dark border-none text-white  font-noto_sans text-center flex flex-center max-w-[300px] bottom-0 left-0 fixed  "
        ),
        title: "Αποτυχία δημιουργίας",
        description: `${error}`,
      });
    } finally {
      setIsCreating(false);
      setStage(0);
      form.reset();
    }
  };
  return (
    <div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="mt-10 flex w-full flex-col items-start justify-start font-noto_sans"
          autoComplete="off"
        >
          {renderDogFields()}
        </form>
      </Form>
      <div className="mb-20 mt-12 flex flex-row justify-center gap-8 self-center">
        <button className="relative p-[3px]" onClick={() => setStage(0)}>
          <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-red-500 to-orange-950" />
          <div className="group relative  rounded-[6px] bg-light-700 px-8  py-2 font-semibold text-dark-300 transition duration-200 hover:bg-transparent dark:bg-black dark:text-white dark:hover:bg-transparent">
            Πίσω
          </div>
        </button>
        <button
          className="relative p-[3px]"
          onClick={form.handleSubmit(onSubmit)}
        >
          <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500" />
          <div className="group relative  rounded-[6px] bg-light-700 px-8  py-2 font-semibold text-dark-300 transition duration-200 hover:bg-transparent dark:bg-black dark:text-white dark:hover:bg-transparent">
            {isCreating ? <Loader className="animate-spin" /> : "Καταχώρηση..."}
          </div>
        </button>
      </div>
    </div>
  );
};

export default DogForm;
