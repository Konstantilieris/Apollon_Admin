import React from "react";
import { FormControl } from "../ui/form";
import { SelectItem } from "../ui/select";
import {
  TypesOfBehavior,
  TypesOfBreed,
  TypesOfFood,
  TypesOfGender,
} from "@/constants";

import CustomFormField, { FormFieldType } from "./CustomFormField";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";

const DogField = ({ form, index }: any) => {
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
      <CustomFormField
        fieldType={FormFieldType.SELECT}
        control={form.control}
        name={`${namePrefix}.behavior`}
        label="Συμπεριφορά"
        placeholder="Συμπεριφορά"
      >
        {TypesOfBehavior.map((behavior, i) => (
          <SelectItem
            key={behavior + i}
            value={behavior}
            className="flex cursor-pointer items-center gap-2"
          >
            <p>{behavior} </p>
          </SelectItem>
        ))}
      </CustomFormField>
      <CustomFormField
        fieldType={FormFieldType.SELECT}
        control={form.control}
        name={`${namePrefix}.breed`}
        label="Ράτσα"
        placeholder="Ράτσα"
      >
        {TypesOfBreed.map((breed, i) => (
          <SelectItem
            key={breed + i}
            value={breed}
            className="flex cursor-pointer items-center gap-2"
          >
            <p>{breed} </p>
          </SelectItem>
        ))}
      </CustomFormField>
      <CustomFormField
        fieldType={FormFieldType.INPUT}
        control={form.control}
        name={`${namePrefix}.microchip`}
        label="Μicrochip"
        placeholder="12323434324234234"
        iconSrc="/assets/icons/chip.svg"
        iconAlt="chip"
      />
      <CustomFormField
        fieldType={FormFieldType.DATE_PICKER}
        control={form.control}
        name={`${namePrefix}.birthdate`}
        label="Ημ.Γέννησης"
      />
      <CustomFormField
        fieldType={FormFieldType.SELECT}
        control={form.control}
        name={`${namePrefix}.food`}
        label="Tύπος Τροφής"
        placeholder="Επέλεξε Τροφή"
      >
        {TypesOfFood.map((food, i) => (
          <SelectItem
            key={food + i}
            value={food}
            className="flex cursor-pointer items-center gap-2"
          >
            <p>{food} </p>
          </SelectItem>
        ))}
      </CustomFormField>
    </section>
  );
};

export default DogField;
