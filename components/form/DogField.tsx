import React from "react";
import { FormControl, FormField } from "../ui/form";

import { TypesOfGender, TypesOfSterilized } from "@/constants";
import {
  Input,
  DatePicker,
  RadioGroup,
  Radio,
  Badge,
  Chip,
  Divider,
} from "@heroui/react";
import { parseDate } from "@internationalized/date";
import { I18nProvider } from "@react-aria/i18n";

import CommandMenuProvider from "../shared/CommandMenu/CommandMenuProvider";
import { CommandMenuType } from "@/hooks/command-menu-store";

const DogField = ({ form, index, breeds, behaviors, foods }: any) => {
  const namePrefix = `dogs[${index}]`;
  return (
    <section className="flex h-full w-full flex-col items-start  space-y-4 py-2">
      <Badge content={index + 1} color="danger" variant="flat">
        <Chip
          color="default"
          variant="bordered"
          className="min-h-[40px] min-w-[100px] text-lg tracking-widest"
        >
          Σκύλος{" "}
        </Chip>
      </Badge>
      <div className="flex w-full flex-col space-y-4 max-lg:px-8 lg:pl-4">
        <div className="flex w-full flex-row justify-start gap-4 max-lg:flex-col">
          <FormField
            control={form.control}
            name={`${namePrefix}.name`}
            render={({ field }) => (
              <FormControl>
                <Input
                  {...field}
                  label="Όνομα"
                  variant="bordered"
                  errorMessage="Η κατηγορία είναι υποχρεωτική"
                  isInvalid={!field.value}
                  className="w-[30vw]  max-lg:w-full"
                  isRequired
                  value={field.value}
                  onValueChange={field.onChange}
                />
              </FormControl>
            )}
          />
          <FormField
            control={form.control}
            name={`${namePrefix}.microchip`}
            render={({ field }) => (
              <FormControl>
                <Input
                  {...field}
                  label="Microchip"
                  variant="bordered"
                  className="w-[30vw]  max-lg:w-full"
                  value={field.value}
                  onValueChange={field.onChange}
                />
              </FormControl>
            )}
          />
        </div>
        <div className="flex w-full flex-row justify-start gap-4 max-lg:flex-col">
          <FormField
            control={form.control}
            name={`${namePrefix}.birthdate`}
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
                      base: "w-[30vw] max-lg:w-full",
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
            name={`${namePrefix}.breed`}
            render={({ field }) => (
              <FormControl>
                <CommandMenuProvider
                  isForm={true}
                  value={field.value}
                  onChange={field.onChange}
                  defaultMenuType={CommandMenuType.Breeds}
                  disabled={true}
                />
              </FormControl>
            )}
          />
        </div>
        <div className="flex w-full flex-row justify-start gap-4 max-lg:flex-col">
          <FormField
            control={form.control}
            name={`${namePrefix}.behavior`}
            render={({ field }) => (
              <FormControl>
                <CommandMenuProvider
                  isForm={true}
                  value={field.value}
                  onChange={field.onChange}
                  defaultMenuType={CommandMenuType.Behaviors}
                  disabled={true}
                />
              </FormControl>
            )}
          />
          <FormField
            control={form.control}
            name={`${namePrefix}.food`}
            render={({ field }) => (
              <FormControl>
                <CommandMenuProvider
                  value={field.value}
                  isForm={true}
                  onChange={field.onChange}
                  defaultMenuType={CommandMenuType.Foods}
                  disabled={true}
                />
              </FormControl>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name={`${namePrefix}.gender`}
          render={({ field }) => (
            <FormControl>
              <RadioGroup
                label="Φύλο"
                orientation="horizontal"
                className="flex w-[30vw] flex-row gap-2  px-2  text-lg  max-lg:w-full"
                onValueChange={field.onChange}
                defaultValue={field.value} // Map boolean to "Ναι" or "Όχι"
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
          name={`${namePrefix}.sterilized`}
          render={({ field }) => (
            <FormControl>
              <RadioGroup
                label="Στειρωμένο"
                orientation="horizontal"
                className="flex w-[30vw] flex-row gap-2  px-2 text-lg  max-lg:w-full"
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
      </div>
      <Divider />
    </section>
  );
};

export default DogField;
