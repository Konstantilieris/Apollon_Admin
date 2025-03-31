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
import { usePathname } from "next/navigation";
import { Button } from "@heroui/react";
const DogForm = ({ number, setStage, client, setSuccessId }: any) => {
  const [isCreating, setIsCreating] = React.useState(false);
  const { toast } = useToast();

  const path = usePathname();
  const form = useForm<z.infer<typeof DogValidation>>({
    resolver: zodResolver(DogValidation),
    defaultValues: {
      dogs: Array.from({ length: number }, () => ({
        name: "",
        gender: "Αρσενικό",
        birthdate: new Date(),
        food: "",
        breed: "",
        behavior: "",
        microchip: "",
        sterilized: false,
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
  const onSubmit = async (
    values: z.infer<typeof DogValidation>,
    event?: React.BaseSyntheticEvent
  ) => {
    event?.preventDefault();
    setIsCreating(true);
    try {
      const newClient = await CreateClient({
        clientData: { ...client },
        dogs: values.dogs,
        path,
      });
      if (newClient) {
        const client = JSON.parse(newClient);

        setSuccessId(client._id);
        setStage([3, 3]);
      }
    } catch (error) {
      toast({
        className: cn(
          "bg-red-dark border-none text-white   text-center flex flex-center max-w-[300px] bottom-0 left-0 fixed  "
        ),
        title: "Αποτυχία δημιουργίας",
        description: `${error}`,
      });
    } finally {
      setIsCreating(false);
      form.reset();
    }
  };
  return (
    <div className=" flex w-full flex-col items-center overflow-y-auto  ">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className=" flex h-full w-full flex-col items-start justify-start space-y-8"
          autoComplete="off"
        >
          {renderDogFields()}
          <div className="mb-20 mt-12 flex h-full w-full flex-row items-center justify-center gap-8 self-end">
            <Button
              onPress={() => setStage(0)}
              color="danger"
              variant="ghost"
              className="tracking-widest"
              size="lg"
            >
              ΠΙΣΩ
            </Button>
            <Button
              type="submit"
              color="success"
              size="lg"
              className="font-semibold tracking-widest"
            >
              {isCreating ? <Loader className="h-6 w-6" /> : "ΑΠΟΘΗΚΕΥΣΗ"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default DogForm;
