import React from "react";
import { FormControl } from "../ui/form";

import { TypesOfGender, TypesOfSterilized } from "@/constants";

import CustomFormField, { FormFieldType } from "./CustomFormField";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";
import ConstantSwitcher from "../shared/constantManagement/ConstantSwitcher";

const DogField = ({ form, index, breeds, behaviors, foods }: any) => {
  const namePrefix = `dogs[${index}]`;
  return (
    <section className="mb-4 w-full space-y-4 ">
      <div className="mb-9 space-y-1">
        <h2 className="sub-header">Στοιχέια Σκύλου {index + 1}</h2>
      </div>
      <CustomFormField
        fieldType={FormFieldType.INPUT}
        control={form.control}
        name={`${namePrefix}.name`}
        placeholder="Σίφης "
        iconSrc="/assets/icons/dog.svg"
        iconAlt="user"
      />{" "}
      <CustomFormField
        fieldType={FormFieldType.SKELETON}
        control={form.control}
        name={`${namePrefix}.gender`}
        label="Φύλο"
        renderSkeleton={(field) => (
          <FormControl>
            <RadioGroup
              className="flex h-11 gap-6  xl:justify-between"
              onValueChange={field.onChange}
              defaultValue={field.value}
            >
              {TypesOfGender.map((option, i) => (
                <div key={option + i} className="radio-group">
                  <RadioGroupItem value={option} id={option} />
                  <Label
                    htmlFor={option}
                    className="cursor-pointer text-dark-300 dark:text-light-700"
                  >
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </FormControl>
        )}
      />
      <div className="flex w-full flex-row gap-7">
        <CustomFormField
          fieldType={FormFieldType.SKELETON}
          control={form.control}
          name={`${namePrefix}.behavior`}
          label="Συμπεριφορά"
          renderSkeleton={(field) => (
            <FormControl>
              <ConstantSwitcher
                items={behaviors.value}
                type="Behaviors"
                label="Συμπεριφορά"
                placeholder="Συμπεριφορά"
                heading="ΣΥΜΠΕΡΙΦΟΡΕΣ"
                selectedItem={field.value}
                setSelectedItem={field.onChange}
              />
            </FormControl>
          )}
        />
        <CustomFormField
          fieldType={FormFieldType.SKELETON}
          control={form.control}
          name={`${namePrefix}.breed`}
          label="Ράτσα"
          renderSkeleton={(field) => (
            <FormControl>
              <ConstantSwitcher
                items={breeds.value}
                type="Breeds"
                label="Ράτσα"
                placeholder="Ράτσα"
                heading="ΡΑΤΣΕΣ"
                selectedItem={field.value}
                setSelectedItem={field.onChange}
              />
            </FormControl>
          )}
        />
      </div>
      <div className="flex w-[21.7vw] flex-row ">
        <CustomFormField
          fieldType={FormFieldType.SKELETON}
          control={form.control}
          name={`${namePrefix}.food`}
          label="Τυπος Τροφής"
          renderSkeleton={(field) => (
            <FormControl>
              <ConstantSwitcher
                items={foods.value}
                type="Foods"
                label="Τροφή"
                placeholder="Τροφές"
                heading="ΤΡΟΦΕΣ"
                selectedItem={field.value}
                setSelectedItem={field.onChange}
              />
            </FormControl>
          )}
        />
      </div>
      <CustomFormField
        fieldType={FormFieldType.DATE_PICKER}
        control={form.control}
        name={`${namePrefix}.birthdate`}
        label="Ημ.Γέννησης"
      />
      <CustomFormField
        fieldType={FormFieldType.SKELETON}
        control={form.control}
        name={`${namePrefix}.sterilized`}
        label="Στειρωμένο"
        renderSkeleton={(field) => (
          <FormControl>
            <RadioGroup
              className="flex h-11 gap-6 xl:justify-between"
              defaultValue={"Όχι"}
              onValueChange={(value) => field.onChange(value === "Ναί")}
            >
              {TypesOfSterilized.map((option: any, i: number) => (
                <div key={option + i} className="radio-group">
                  <RadioGroupItem value={option} id={option} />
                  <Label
                    htmlFor={option}
                    className="cursor-pointer text-dark-300 dark:text-light-700"
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
        name={`${namePrefix}.microchip`}
        label="Μicrochip"
        placeholder="12323434324234234"
        iconSrc="/assets/icons/chip.svg"
        iconAlt="chip"
      />
    </section>
  );
};

export default DogField;
