"use client";
import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Form } from "@/components/ui/form";
import "react-phone-number-input/style.css";
import { UpdateClientValidation } from "@/lib/validation";
import * as z from "zod";

import { SelectItem } from "@/components/ui/select";
import { TypesOfProfessions, TypesOfResidence } from "@/constants";
import CustomFormField, { FormFieldType } from "./CustomFormField";
import { Button } from "../ui/moving-border";
import { updateClient } from "@/lib/actions/client.action";
import { useToast } from "../ui/use-toast";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

const UpdateClientForm = ({ client }: any) => {
  const { toast } = useToast();
  const path = usePathname();
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
    },
  });

  async function onSubmit(values: z.infer<typeof UpdateClientValidation>) {
    try {
      const res = await updateClient({ id: client._id, data: values, path });

      if (res) {
        const newClient = JSON.parse(res);
        toast({
          className: cn(
            "bg-celtic-green border-none text-white  font-sans text-center flex flex-center max-w-[300px] bottom-0 left-0 fixed  "
          ),
          title: "Επιτυχία",
          description: `Ο πελάτης ${newClient.name} ενημερώθηκε`,
        });
      }
    } catch (error) {
      toast({
        className: cn(
          "bg-red-dark border-none text-white  font-sans text-center flex flex-center max-w-[300px] bottom-0 left-0 fixed  "
        ),
        title: "Αποτυχία δημιουργίας",
        description: `${error}`,
      });
    } finally {
      form.reset();
    }
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="my-8 flex flex-col "
      >
        <section className="space-y-6">
          <div className="mb-9 space-y-1">
            <h2 className="sub-header">Προσωπικά Στοιχεία</h2>
          </div>

          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="name"
            placeholder="Σάββας Ντούνης "
            iconSrc="/assets/icons/account.svg"
            iconAlt="user"
          />

          <div className="flex flex-col gap-6 xl:flex-row">
            <CustomFormField
              fieldType={FormFieldType.INPUT}
              control={form.control}
              name="email"
              label="Email address"
              placeholder="johndoe@gmail.com"
              iconSrc="/assets/icons/email.svg"
              iconAlt="email"
            />

            <CustomFormField
              fieldType={FormFieldType.SELECT}
              control={form.control}
              name="profession"
              label="Επάγγελμα"
              placeholder="Δικηγόρος"
              iconSrc="/assets/icons/user.svg"
              iconAlt="user"
            >
              {TypesOfProfessions.map((profession, i) => (
                <SelectItem
                  key={profession + i}
                  value={profession}
                  className="flex cursor-pointer items-center gap-2"
                >
                  <p>{profession} </p>
                </SelectItem>
              ))}
            </CustomFormField>
          </div>
          <div className=" flex flex-col gap-6">
            <h2 className="sub-header ">Στοιχέια Επικοινωνίας</h2>
            <CustomFormField
              fieldType={FormFieldType.PHONE_INPUT}
              control={form.control}
              name="mobile"
              label="Κινητό"
              placeholder="6971234567"
            />
            <CustomFormField
              fieldType={FormFieldType.PHONE_INPUT}
              control={form.control}
              name="telephone"
              label="Τηλ.Οικίας"
              placeholder="2101234567"
            />
            <CustomFormField
              fieldType={FormFieldType.PHONE_INPUT}
              control={form.control}
              name="workMobile"
              label="Τηλέφωνο Εργασίας"
              placeholder="2101234567"
            />
            <CustomFormField
              fieldType={FormFieldType.INPUT}
              control={form.control}
              name="emergencyContact"
              label="Έκτακτη Επαφή"
              placeholder="Συζυγος - 6971234567"
              iconSrc="/assets/icons/phone.svg"
              iconAlt="user"
            />
          </div>
        </section>
        <section className="mt-6 space-y-6">
          <div>
            <h2 className="sub-header">Στοιχεία Διεύθυνσης</h2>
          </div>
          <CustomFormField
            control={form.control}
            name="residence"
            fieldType={FormFieldType.SELECT}
            label="Τύπος Διαμερίσματος"
            placeholder="Διαμέρισμα"
          >
            {TypesOfResidence.map((residence, i) => (
              <SelectItem
                key={residence + i}
                value={residence}
                className="flex cursor-pointer items-center gap-2"
              >
                <p>{residence} </p>
              </SelectItem>
            ))}
          </CustomFormField>
          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="city"
            label="Πόλη"
            placeholder="Αθήνα"
            iconSrc="/assets/icons/location.svg"
            iconAlt="location"
          />
          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="address"
            label="Διεύθυνση"
            placeholder="Λεωφόρος Κηφισίας 123"
            iconSrc="/assets/icons/location.svg"
            iconAlt="location"
          />
          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="postalCode"
            label="Ταχυδρομικός Κώδικας"
            placeholder="12345"
            iconSrc="/assets/icons/location.svg"
            iconAlt="location"
          />
        </section>
        <section className="mt-6 space-y-6">
          <div>
            {" "}
            <h2 className="sub-header">Στοιχεία Κτηνιάτρου </h2>
          </div>

          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="vetName"
            label="Κτηνίατρος Πελάτη"
            placeholder="Κτηνίατρος"
            iconSrc="/assets/icons/vet.svg"
            iconAlt="vet"
          />
          <CustomFormField
            fieldType={FormFieldType.PHONE_INPUT}
            control={form.control}
            name="vetNumber"
            label="Τηλέφωνο Κτηνίατρου"
            placeholder="2101234567"
          />
        </section>

        <div className="my-8 flex w-full justify-end">
          <Button
            borderRadius="1.75rem"
            className="border-neutral-200 bg-white text-black hover:scale-105 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
            onClick={() => form.handleSubmit(onSubmit)}
          >
            ΑΠΟΘΗΚΕΥΣΗ
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default UpdateClientForm;
