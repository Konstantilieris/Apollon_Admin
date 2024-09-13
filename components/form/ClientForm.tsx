"use client";
import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Form, FormControl } from "@/components/ui/form";

import { ClientValidation } from "@/lib/validation";
import * as z from "zod";

import { SelectItem } from "@/components/ui/select";
import { TypesOfResidence } from "@/constants";
import CustomFormField, { FormFieldType } from "./CustomFormField";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";
import ReferenceCommand from "../shared/reference/ReferenceCommand";
import ConstantSwitcher from "../shared/constantManagement/ConstantSwitcher";

const ClientForm = ({ setData, setStage, clients, professions }: any) => {
  const form = useForm<z.infer<typeof ClientValidation>>({
    resolver: zodResolver(ClientValidation),
    defaultValues: {
      name: "",
      email: "",
      profession: "",
      residence: "",
      city: "",
      address: "",
      postalCode: "",
      mobile: "",
      telephone: "",
      emergencyContact: "",
      workMobile: "",
      vetName: "",
      vetNumber: "",
      vetWorkPhone: "",
      numberOfDogs: "1",
    },
  });
  const [reference, setReference] = React.useState<any>();
  async function onSubmit(values: z.infer<typeof ClientValidation>) {
    setData({ ...values, reference });
    setStage(1);
    setReference(null);
    form.reset();
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mt-8 flex-1 space-y-12"
      >
        <section className="space-y-6">
          <div className="mb-9 space-y-1">
            <h2 className="sub-header">Προσωπικά Στοιχεία</h2>
          </div>
          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="name"
            iconSrc="/assets/icons/account.svg"
            iconAlt="user"
          />
          <ReferenceCommand
            clients={clients}
            value={reference}
            onChange={setReference}
          />
          <div className="flex flex-col gap-6 xl:flex-row xl:items-start">
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
              fieldType={FormFieldType.SKELETON}
              control={form.control}
              name="profession"
              label="Επάγγελμα"
              renderSkeleton={(field) => (
                <FormControl>
                  <ConstantSwitcher
                    items={professions.value}
                    type="Professions"
                    label="Επάγγελμα"
                    placeholder="Επάγγελμα"
                    heading="ΕΠΑΓΓΕΛΜΑΤΑ"
                    selectedItem={field.value}
                    setSelectedItem={field.onChange}
                  />
                </FormControl>
              )}
            />
          </div>
          <div className=" flex flex-col gap-6">
            <h2 className="sub-header ">Στοιχέια Επικοινωνίας</h2>
            <CustomFormField
              fieldType={FormFieldType.PHONE_INPUT}
              control={form.control}
              name="mobile"
              label="Κινητό"
            />
            <CustomFormField
              fieldType={FormFieldType.PHONE_INPUT}
              control={form.control}
              name="telephone"
              label="Τηλ.Οικίας"
            />
            <CustomFormField
              fieldType={FormFieldType.PHONE_INPUT}
              control={form.control}
              name="workMobile"
              label="Τηλέφωνο Εργασίας"
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
        <section className="space-y-6">
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
            iconSrc="/assets/icons/location.svg"
            iconAlt="location"
          />
          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="address"
            label="Διεύθυνση"
            iconSrc="/assets/icons/location.svg"
            iconAlt="location"
          />
          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="postalCode"
            label="Ταχυδρομικός Κώδικας"
            iconSrc="/assets/icons/location.svg"
            iconAlt="location"
          />
        </section>
        <section className="space-y-6">
          <div>
            {" "}
            <h2 className="sub-header">Στοιχεία Κτηνιάτρου Και Σκύλοι</h2>
          </div>

          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="vetName"
            label="Κτηνίατρος Πελάτη"
            iconSrc="/assets/icons/vet.svg"
            iconAlt="vet"
          />
          <CustomFormField
            fieldType={FormFieldType.PHONE_INPUT}
            control={form.control}
            name="vetNumber"
            label="Τηλ. Κτηνίατρου"
          />
          <CustomFormField
            fieldType={FormFieldType.PHONE_INPUT}
            control={form.control}
            name="vetWorkPhone"
            label="Τηλ. Εργ. Κτηνίατρου"
          />
          <CustomFormField
            fieldType={FormFieldType.SKELETON}
            control={form.control}
            name="numberOfDogs"
            label="Αριθμός Σκύλων"
            renderSkeleton={(field) => (
              <FormControl>
                <RadioGroup
                  className="flex h-11 gap-6  xl:justify-between"
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  {["1", "2", "3", "4", "5"].map((option, i) => (
                    <div key={option + i} className="radio-group">
                      <RadioGroupItem value={option} id={option} />
                      <Label
                        htmlFor={option}
                        className="cursor-pointer text-dark-500 dark:text-light-700"
                      >
                        {option}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </FormControl>
            )}
          />
        </section>

        <div className=" mb-8 flex w-full justify-center ">
          <button className="relative p-[3px]" type="submit">
            <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500" />
            <div className="group relative  rounded-[6px] bg-light-700 px-8  py-2 font-semibold text-dark-300 transition duration-200 hover:bg-transparent dark:bg-black dark:text-white dark:hover:bg-transparent">
              Καταχώρηση και επόμενο
            </div>
          </button>
        </div>
      </form>
    </Form>
  );
};

export default ClientForm;
