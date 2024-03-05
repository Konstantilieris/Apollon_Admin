"use client";
import { DogValidation } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Form } from "../ui/form";
import DogField from "./DogField";
import { Button } from "../ui/button";
const DogForm = ({ number, setDogs, setStage }: any) => {
  const form = useForm<z.infer<typeof DogValidation>>({
    resolver: zodResolver(DogValidation),
    defaultValues: {
      dogs: Array.from({ length: number }, () => ({
        name: "",
        gender: "",
        birthdate: new Date(),
        food: "",
        breed: "",
        behavior: "",
      })),
    },
  });
  const renderDogFields = () => {
    const dogFields = [];
    for (let i = 0; i < number; i++) {
      dogFields.push(<DogField key={i} form={form} index={i} />);
    }
    return dogFields;
  };
  const onSubmit = (values: z.infer<typeof DogValidation>) => {
    setDogs(values);
    setStage(100);
    form.reset();
  };
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mt-10 flex w-full flex-col font-noto_sans "
        autoComplete="off"
      >
        <div className="flex flex-row justify-center gap-4">
          {renderDogFields()}
        </div>
        <div className="flex flex-row gap-8 self-center">
          <Button
            className="  mt-8 min-w-[135px] self-center bg-red-dark py-6 font-noto_sans text-[20px] font-extrabold text-white hover:scale-105 hover:animate-pulse"
            onClick={() => setStage(25)}
          >
            {" "}
            ΠΙΣΩ
          </Button>
          <Button
            type="submit"
            className="mt-8 w-fit bg-primary-500 p-6 font-noto_sans text-lg font-bold text-black hover:scale-105 hover:animate-pulse "
          >
            ΕΠΟΜΕΝΟ
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default DogForm;
