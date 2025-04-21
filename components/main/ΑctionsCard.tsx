"use client";
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import * as z from "zod";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import CustomFormField, {
  FormFieldType,
} from "@/components/form/CustomFormField";
import { Form } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { EmailValidation } from "@/lib/validation";
import { sendEmail } from "@/lib/actions/messages.action";
import { IconMapPin } from "@tabler/icons-react";
import { toast } from "sonner";
import { Button } from "../ui/button";
type CardProps = React.ComponentProps<typeof Card>;

export function ActionsCard({ className, ...props }: CardProps) {
  const form = useForm<z.infer<typeof EmailValidation>>({
    resolver: zodResolver(EmailValidation),
    defaultValues: {
      email: "",
    },
  });
  async function onSubmit(values: z.infer<typeof EmailValidation>) {
    try {
      const res = await sendEmail(values.email);
      if (res.success) toast.success("Το email στάλθηκε επιτυχώς.");
    } catch (error) {
      console.log(error);
      toast.error("Σφάλμα κατά την αποστολή του email.");
    } finally {
      form.reset();
    }
  }
  return (
    <Card
      className={cn(
        "flex flex-col background-light900_dark200 border-none w-[20vw] shadow-sm shadow-neutral-500",
        className
      )}
      {...props}
    >
      <CardHeader>
        <CardTitle>Ενέργειες</CardTitle>
        <CardDescription>Στείλε τοποθεσία στον πελάτη</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="mt-8 flex-1 space-y-12"
          >
            <CustomFormField
              fieldType={FormFieldType.INPUT}
              control={form.control}
              name="email"
              label="Email"
              iconSrc="/assets/icons/email.svg"
              iconAlt="email"
            />
            <Button
              className=" flex items-center space-x-4 rounded-md border p-4 hover:bg-slate-900"
              onClick={form.handleSubmit(onSubmit)}
            >
              <IconMapPin />
              <div className="flex-1 space-y-1">
                <p className="text-sm text-muted-foreground">
                  Στείλε τοποθεσία στον πελάτη
                </p>
              </div>
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="mt-20"></CardFooter>
    </Card>
  );
}
