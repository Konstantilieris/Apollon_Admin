"use client";
import React from "react";

import { Input, DatePicker, RadioGroup, Radio } from "@heroui/react";
import { I18nProvider } from "@react-aria/i18n";
import { FormControl, FormField } from "@/components/ui/form";
import { parseDate } from "@internationalized/date";
import CommandMenuProvider from "../shared/CommandMenu/CommandMenuProvider";
import { CommandMenuType } from "@/hooks/command-menu-store";
import { TypesOfGender, TypesOfSterilized } from "@/constants";

const SingleDogForm = ({ form }: any) => {
  console.log("SingleDogForm", form.getValues());
  return (
    <section className="flex w-full flex-col items-center justify-center space-y-4">
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormControl>
            <Input
              {...field}
              label="Όνομα"
              variant="bordered"
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
        name="microchip"
        render={({ field }) => (
          <FormControl>
            <Input
              {...field}
              label="Microchip"
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
        name="birthdate"
        render={({ field }) => (
          <FormControl>
            <I18nProvider locale="el">
              <DatePicker
                {...field}
                label="Ημερομηνία Γέννησης"
                placeholder="Ημερομηνία Γέννησης"
                variant="bordered"
                color="secondary"
                selectorButtonPlacement="start"
                hideTimeZone
                showMonthAndYearPickers
                classNames={{
                  popoverContent: " font-sans",
                  input: "w-[200px]",
                  base: "min-w-[30vw] max-w-[30vw]",
                  calendar: "w-full h-full",
                }}
                value={
                  !field.value
                    ? undefined
                    : typeof field.value === "string"
                      ? parseDate((field.value as string).split("T")[0])
                      : parseDate(
                          (field.value as Date).toISOString().split("T")[0]
                        )
                }
                onChange={(val) => {
                  if (!val) {
                    field.onChange(null);
                    return;
                  }
                  const utcMidnight = new Date(
                    Date.UTC(val.year, val.month - 1, val.day)
                  );
                  field.onChange(utcMidnight.toISOString());
                }}
              />
            </I18nProvider>
          </FormControl>
        )}
      />
      <FormField
        control={form.control}
        name="breed"
        render={({ field }) => (
          <div className="flex w-[30vw] flex-col justify-center gap-2 px-1">
            <h1 className="text-start text-sm tracking-wide text-gray-400">
              Ράτσα
            </h1>
            <FormControl>
              <CommandMenuProvider
                isForm={true}
                value={field.value}
                onChange={field.onChange}
                defaultMenuType={CommandMenuType.Breeds}
                disabled={true}
              />
            </FormControl>
          </div>
        )}
      />
      <FormField
        control={form.control}
        name="behavior"
        render={({ field }) => (
          <div className="flex w-[30vw] flex-col justify-center gap-2 px-1">
            <h1 className="text-start text-sm tracking-wide text-gray-400 ">
              Συμπεριφορά
            </h1>
            <FormControl>
              <CommandMenuProvider
                isForm={true}
                value={field.value}
                onChange={field.onChange}
                defaultMenuType={CommandMenuType.Behaviors}
                disabled={true}
              />
            </FormControl>
          </div>
        )}
      />
      <FormField
        control={form.control}
        name="food"
        render={({ field }) => (
          <div className="flex w-[30vw] flex-col justify-center gap-2 px-1">
            <h1 className="text-start text-sm tracking-wide text-gray-400">
              Τύπος Τροφής
            </h1>
            <FormControl>
              <CommandMenuProvider
                value={field.value}
                isForm={true}
                onChange={field.onChange}
                defaultMenuType={CommandMenuType.Foods}
                disabled={true}
              />
            </FormControl>
          </div>
        )}
      />
      <FormField
        control={form.control}
        name={`gender`}
        render={({ field }) => (
          <FormControl>
            <RadioGroup
              label="Στειρωμένο"
              orientation="horizontal"
              className="flex w-[30vw] flex-row gap-2  px-2 "
              onValueChange={field.onChange}
              defaultValue={field.value}
              color="danger"
            >
              {TypesOfGender.map((option, i) => (
                <Radio value={option} key={i + option}>
                  {option}
                </Radio>
              ))}
            </RadioGroup>
          </FormControl>
        )}
      />
      <FormField
        control={form.control}
        name={`sterilized`}
        render={({ field }) => (
          <FormControl>
            <RadioGroup
              label="Στειρωμένο"
              orientation="horizontal"
              className="flex w-[30vw] flex-row gap-2  px-2 "
              onValueChange={(value) => field.onChange(value === "Ναι")}
              defaultValue={field.value ? "Ναι" : "Όχι"} // Map boolean to "Ναι" or "Όχι"
              color="secondary"
            >
              {TypesOfSterilized.map((option, i) => (
                <Radio value={option.label} key={i + option.label}>
                  {option.label}
                </Radio>
              ))}
            </RadioGroup>
          </FormControl>
        )}
      />
    </section>
  );
};

export default SingleDogForm;
