"use client";
import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Form, FormControl } from "@/components/ui/form";
import "react-phone-number-input/style.css";
import { ClientValidation } from "@/lib/validation";
import * as z from "zod";

import { SelectItem } from "@/components/ui/select";
import { TypesOfProfessions, TypesOfResidence } from "@/constants";
import CustomFormField, { FormFieldType } from "./CustomFormField";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";
import ReferenceCommand from "../shared/reference/ReferenceCommand";

const ClientForm = ({ setData, setStage, clients }: any) => {
  const form = useForm<z.infer<typeof ClientValidation>>({
    resolver: zodResolver(ClientValidation),
    defaultValues: {
      name: "",
      reference: {},
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
      numberOfDogs: "1",
    },
  });

  async function onSubmit(values: z.infer<typeof ClientValidation>) {
    setData({ ...values });

    setStage(1);
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
            placeholder="Σάββας Ντούνης "
            iconSrc="/assets/icons/account.svg"
            iconAlt="user"
          />
          <CustomFormField
            fieldType={FormFieldType.SKELETON}
            control={form.control}
            name="reference"
            label="Σύσταση"
            renderSkeleton={(field) => (
              <ReferenceCommand
                clients={clients}
                value={field.value}
                onChange={field.onChange}
              />
            )}
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
        <section className="space-y-6">
          <div>
            {" "}
            <h2 className="sub-header">Στοιχεία Κτηνιάτρου Και Σκύλοι</h2>
          </div>
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
