"use client";
import * as z from "zod";
import { useConstantModal } from "@/hooks/use-constant-modal";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
} from "@/components/ui/animated-modal";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { pushValueOnConstant } from "@/lib/actions/constant.action";
import { toast } from "sonner";

const ConstantModal = () => {
  const [loading, setLoading] = useState(false);
  const path = usePathname();

  const formSchema = z.object({
    name: z
      .string()
      .min(1, { message: "Απαιτείται όνομα" })
      .max(255, { message: "Name is too long" }),
  });
  const constantModal = useConstantModal();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "" },
  });
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    constantModal.addNewConstantOptimistic(
      values.name,
      constantModal.openModalType!
    );
    try {
      const res = await pushValueOnConstant({
        type: constantModal.openModalType!,
        value: values.name,
        path,
      });
      if (res) {
        const category = JSON.parse(res);
        toast.success(`Η κατηγορία ${category.name} προστέθηκε επιτυχώς!`);
      }
    } catch (error) {
      toast.error(`Σφάλμα κατά την προσθήκη της κατηγορίας ${values.name}.`);
    } finally {
      setLoading(false);
      constantModal.onClose();
      form.reset();
    }
  };

  return (
    <Modal>
      <ModalBody
        isOpen={constantModal.openModalType !== null}
        setOpen={constantModal.onClose}
        className="z-50  bg-dark-100 text-white"
      >
        <ModalContent className=" justify-around ">
          <h1 className="self-center text-2xl font-semibold text-purple-400">
            {constantModal?.modalLabel}
          </h1>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-purple-400">ONOMA</FormLabel>
                    <FormControl className="border-purple-400  bg-dark-500 text-light-700 ">
                      <Input
                        placeholder="Ονομα"
                        {...field}
                        autoComplete="off"
                      />
                    </FormControl>

                    <FormMessage className=" text-red-500" />
                  </FormItem>
                )}
              />
              <div className="flex w-full items-center justify-end space-x-2 pt-6"></div>
            </form>
          </Form>
        </ModalContent>
        <ModalFooter className="gap-2 bg-purple-400 ">
          <Button
            className="border-2 border-red-800 bg-dark-200  text-light-700 transition-colors hover:scale-105   hover:bg-red-800"
            onClick={constantModal.onClose}
            variant={null}
          >
            Ακύρωση
          </Button>
          <Button
            onClick={form.handleSubmit(onSubmit)}
            className="border border-dark-100 bg-purple-800  transition-colors hover:scale-105 hover:bg-purple-900"
            variant={null}
          >
            {loading ? (
              <Image
                src={"/icons/load.svg"}
                width={20}
                height={20}
                alt="load"
                className="animate-spin"
              />
            ) : (
              "Αποθήκευση"
            )}
          </Button>
        </ModalFooter>
      </ModalBody>
    </Modal>
  );
};
export default ConstantModal;
