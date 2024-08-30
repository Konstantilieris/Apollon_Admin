"use client";
import React, { useEffect } from "react";
import { FormControl } from "../ui/form";

import { TypesOfGender, TypesOfSterilized } from "@/constants";

import CustomFormField, { FormFieldType } from "./CustomFormField";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";
import ConstantSwitcher from "../shared/constantManagement/ConstantSwitcher";

import useStore from "@/hooks/use-store-constants";

import LoadingSkeleton from "../shared/skeletons/LoadingSkeleton";

const SingleDogForm = ({ form }: any) => {
  const { foods, behaviors, breeds, loading, error, fetchConstants } =
    useStore();

  useEffect(() => {
    // Invoke the function defined in the store
    fetchConstants();
  }, [fetchConstants]);

  if (loading)
    return (
      <div className="flex h-full w-full items-center justify-center">
        <LoadingSkeleton size={200} animation="animate-spin" />
      </div>
    );
  if (error) return <p>Error: {error}</p>;

  return (
    <section className="mb-4 w-full space-y-4 ">
      <CustomFormField
        fieldType={FormFieldType.INPUT}
        control={form.control}
        name={`name`}
        placeholder="Σίφης "
        iconSrc="/assets/icons/dog.svg"
        iconAlt="user"
      />{" "}
      <CustomFormField
        fieldType={FormFieldType.SKELETON}
        control={form.control}
        name={`gender`}
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
        fieldType={FormFieldType.SKELETON}
        control={form.control}
        name={`behavior`}
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
        name={`breed`}
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
      <CustomFormField
        fieldType={FormFieldType.INPUT}
        control={form.control}
        name={`microchip`}
        label="Μicrochip"
        placeholder="12323434324234234"
        iconSrc="/assets/icons/chip.svg"
        iconAlt="chip"
      />
      <CustomFormField
        fieldType={FormFieldType.DATE_PICKER}
        control={form.control}
        name={`birthdate`}
        label="Ημ.Γέννησης"
      />
      <CustomFormField
        fieldType={FormFieldType.SKELETON}
        control={form.control}
        name={`food`}
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
      <CustomFormField
        fieldType={FormFieldType.SKELETON}
        control={form.control}
        name={`sterilized`}
        label="Στειρωμένο"
        renderSkeleton={(field) => (
          <FormControl>
            <RadioGroup
              className="flex h-11 gap-6  xl:justify-between"
              onValueChange={field.onChange}
              defaultValue={field.value}
            >
              {TypesOfSterilized.map((option, i) => (
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
    </section>
  );
};

export default SingleDogForm;
