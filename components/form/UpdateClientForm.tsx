"use client";
import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Form, FormControl, FormField } from "@/components/ui/form";
import "react-phone-number-input/style.css";
import { UpdateClientValidation } from "@/lib/validation";
import * as z from "zod";
import { Select, SelectItem } from "@heroui/select";
import { TypesOfResidence } from "@/constants";

import { Button, Input } from "@heroui/react";
import { updateClient } from "@/lib/actions/client.action";
import { useToast } from "../ui/use-toast";
import { cn } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";

import CommandMenuProvider from "../shared/CommandMenu/CommandMenuProvider";
import { CommandMenuType } from "@/hooks/command-menu-store";
import { useModalStore } from "@/hooks/client-profile-store";

const UpdateClientForm = ({ client }: any) => {
  const { toast } = useToast();
  const { closeModal } = useModalStore();
  const path = usePathname();
  const router = useRouter();
  const form = useForm<z.infer<typeof UpdateClientValidation>>({
    resolver: zodResolver(UpdateClientValidation),
    defaultValues: {
      name: client?.name ? client.name : "",
      email: client?.email ? client.email : "",
      profession: client?.profession ? client.profession : "",
      residence: client?.location?.residence ? client.location.residence : "",
      city: client?.location?.city ? client.location.city : "",
      address: client?.location?.address ? client.location.address : "",
      postalCode: client?.location?.postalCode
        ? client.location.postalCode
        : "",
      mobile: client?.phone?.mobile ? client.phone.mobile : "",
      telephone: client?.phone?.telephone ? client.phone.telephone : "",
      emergencyContact: client?.phone?.emergencyContact,
      workMobile: client?.phone?.work_phone,
      vetName: client?.vet?.name,
      vetNumber: client?.vet?.phone,
      vetWorkPhone: client?.vet?.work_phone,
      vetLocation: {
        city: client?.vet?.location?.city,
        address: client?.vet?.location?.address,
        postalCode: client?.vet?.location?.postalCode,
      },
    },
  });

  async function onSubmit(values: z.infer<typeof UpdateClientValidation>) {
    try {
      const res = await updateClient({ id: client._id, data: values, path });

      if (res) {
        const newClient = JSON.parse(res);
        toast({
          className: cn(
            "bg-celtic-green border-none text-white   text-center flex flex-center max-w-[300px] bottom-0 left-0 fixed  "
          ),
          title: "Επιτυχία",
          description: `Ο πελάτης ${newClient.name} ενημερώθηκε`,
        });
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
      form.reset();
      router.refresh();
      closeModal();
    }
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="my-8 flex  flex-col items-center"
      >
        <section className="space-y-6 ">
          <div className="mb-9 space-y-1">
            <h2 className="sub-header tracking-widest">Προσωπικά Στοιχεία</h2>
          </div>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormControl>
                <Input
                  {...field}
                  label="Όνομα"
                  variant="bordered"
                  color="secondary"
                  errorMessage="Η κατηγορία είναι υποχρεωτική"
                  isInvalid={!field.value}
                  className="w-[30vw]"
                  isRequired
                  value={field.value}
                  onValueChange={field.onChange}
                />
              </FormControl>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field, fieldState }) => (
              <FormControl>
                <Input
                  {...field}
                  label="Email"
                  variant="bordered"
                  color="secondary"
                  isInvalid={fieldState.error?.type === "invalid_email"}
                  errorMessage={fieldState.error?.message}
                  className="w-[30vw]"
                  value={field.value}
                  onValueChange={field.onChange}
                />
              </FormControl>
            )}
          />
          <FormField
            control={form.control}
            name="profession"
            render={({ field }) => (
              <div>
                <FormControl>
                  <CommandMenuProvider
                    isForm={true}
                    value={field.value}
                    onChange={field.onChange}
                    defaultMenuType={CommandMenuType.Professions}
                    disabled={true}
                  />
                </FormControl>
              </div>
            )}
          />

          <div className=" flex flex-col gap-6">
            <h2 className="sub-header tracking-widest">
              Στοιχεία Επικοινωνίας
            </h2>
            <FormField
              control={form.control}
              name="mobile"
              render={({ field }) => (
                <FormControl>
                  <Input
                    {...field}
                    color="warning"
                    label="Κινητό"
                    variant="bordered"
                    className="w-[30vw]"
                    value={field.value}
                    onValueChange={field.onChange}
                  />
                </FormControl>
              )}
            />
            <FormField
              control={form.control}
              name="telephone"
              render={({ field }) => (
                <FormControl>
                  <Input
                    {...field}
                    color="warning"
                    label="Σταθερό"
                    variant="bordered"
                    className="w-[30vw]"
                    value={field.value}
                    onValueChange={field.onChange}
                  />
                </FormControl>
              )}
            />
            <FormField
              control={form.control}
              name="emergencyContact"
              render={({ field }) => (
                <FormControl>
                  <Input
                    {...field}
                    label="Έκτακτη Επαφή"
                    color="warning"
                    variant="bordered"
                    className="w-[30vw]"
                    value={field.value}
                    onValueChange={field.onChange}
                  />
                </FormControl>
              )}
            />
            <FormField
              control={form.control}
              name="workMobile"
              render={({ field }) => (
                <FormControl>
                  <Input
                    {...field}
                    label="Τηλέφωνο Εργασίας"
                    color="warning"
                    variant="bordered"
                    className="w-[30vw]"
                    value={field.value}
                    onValueChange={field.onChange}
                  />
                </FormControl>
              )}
            />
          </div>
          <div className="space-y-6">
            <h2 className="sub-header tracking-widest">Στοιχεία Διεύθυνσης</h2>
            <FormField
              name="city"
              control={form.control}
              render={({ field }) => (
                <FormControl>
                  <Input
                    {...field}
                    color="danger"
                    label="Πόλη"
                    variant="bordered"
                    className="w-[30vw]"
                    value={field.value}
                    onValueChange={field.onChange}
                  />
                </FormControl>
              )}
            />
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormControl>
                  <Input
                    {...field}
                    label="Διεύθυνση"
                    variant="bordered"
                    color="danger"
                    className="w-[30vw]"
                    value={field.value}
                    onValueChange={field.onChange}
                  />
                </FormControl>
              )}
            />
            <FormField
              control={form.control}
              name="postalCode"
              render={({ field }) => (
                <FormControl>
                  <Input
                    {...field}
                    label="Ταχυδρομικός Κώδικας"
                    variant="bordered"
                    color="danger"
                    className="w-[30vw]"
                    value={field.value}
                    onValueChange={field.onChange}
                  />
                </FormControl>
              )}
            />
            <FormField
              control={form.control}
              name="residence"
              render={({ field }) => (
                <FormControl>
                  <Select
                    {...field}
                    label="Τύπος Κατοικίας"
                    variant="bordered"
                    color="danger"
                    className="w-[30vw]"
                    classNames={{
                      value: "font-sans",
                      listbox: "font-sans tracking-wide text-xl",
                    }}
                    placeholder="Επιλέξτε"
                    selectedKeys={
                      field.value ? new Set([field.value]) : new Set()
                    }
                    // Whenever the user selects a new key, update form state
                    onSelectionChange={(keys: any) => {
                      // 'keys' is iterable. For single select, we take the first item.
                      const selectedKey = keys.values().next().value;
                      field.onChange(selectedKey);
                    }}
                  >
                    {TypesOfResidence.map((residence) => (
                      <SelectItem key={residence}>{residence}</SelectItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            />
          </div>
          <div className="space-y-6">
            <h2 className="sub-header tracking-widest">Στοιχεία Κτηνίατρου</h2>
            <FormField
              control={form.control}
              name="vetName"
              render={({ field }) => (
                <FormControl>
                  <Input
                    {...field}
                    label="Όνομα Κτηνίατρου"
                    variant="bordered"
                    color="success"
                    className="w-[30vw]"
                    value={field.value}
                    onValueChange={field.onChange}
                  />
                </FormControl>
              )}
            />
            <FormField
              control={form.control}
              name="vetNumber"
              render={({ field }) => (
                <FormControl>
                  <Input
                    {...field}
                    label="Τηλέφωνο Κτηνίατρου"
                    variant="bordered"
                    color="success"
                    className="w-[30vw]"
                    value={field.value}
                    onValueChange={field.onChange}
                  />
                </FormControl>
              )}
            />
            <FormField
              control={form.control}
              name="vetWorkPhone"
              render={({ field }) => (
                <FormControl>
                  <Input
                    {...field}
                    label="Τηλέφωνο Εργασίας Κτηνίατρου"
                    variant="bordered"
                    color="success"
                    className="w-[30vw]"
                    value={field.value}
                    onValueChange={field.onChange}
                  />
                </FormControl>
              )}
            />

            <FormField
              control={form.control}
              name="vetLocation.city"
              render={({ field }) => (
                <FormControl>
                  <Input
                    {...field}
                    label="Πόλη"
                    color="success"
                    variant="bordered"
                    className="w-[30vw]"
                    value={field.value}
                    onValueChange={field.onChange}
                  />
                </FormControl>
              )}
            />
            <FormField
              control={form.control}
              name="vetLocation.address"
              render={({ field }) => (
                <FormControl>
                  <Input
                    {...field}
                    label="Διεύθυνση"
                    variant="bordered"
                    color="success"
                    className="w-[30vw]"
                    value={field.value}
                    onValueChange={field.onChange}
                  />
                </FormControl>
              )}
            />
            <FormField
              control={form.control}
              name="vetLocation.postalCode"
              render={({ field }) => (
                <FormControl>
                  <Input
                    {...field}
                    label="Ταχυδρομικός Κώδικας"
                    variant="bordered"
                    className="w-[30vw]"
                    color="success"
                    value={field.value}
                    onValueChange={field.onChange}
                  />
                </FormControl>
              )}
            />
          </div>
          <div className="flex w-full justify-center">
            <Button color="success" variant="ghost" type="submit">
              ΑΠΟΘΗΚΕΥΣΗ
            </Button>
          </div>
        </section>
      </form>
    </Form>
  );
};

export default UpdateClientForm;
