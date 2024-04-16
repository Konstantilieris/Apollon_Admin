"use client";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { LogInValidation } from "@/lib/validation";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useToast } from "../ui/use-toast";
import { cn } from "@/lib/utils";
import Image from "next/image";

const LogInForm = () => {
  // eslint-disable-next-line no-unused-vars
  const router = useRouter();
  // eslint-disable-next-line no-unused-vars
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const form = useForm<z.infer<typeof LogInValidation>>({
    resolver: zodResolver(LogInValidation),
    defaultValues: {
      name: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof LogInValidation>) => {
    setIsSubmitting(true);
    const res = await signIn("credentials", {
      name: values.name,
      password: values.password,
      redirect: false,
    });
    if (res?.error) {
      toast({
        className: cn(
          "bg-red-dark border-none text-white  font-noto_sans text-center flex flex-center max-w-[300px] bottom-0 left-0 fixed  "
        ),
        title: "Failed to Login try again!",
        description: `${res?.error}`,
      });
    } else {
      toast({
        className: cn(
          "bg-celtic-green border-none text-white  font-noto_sans text-center flex flex-center max-w-[300px] bottom-0 left-0 fixed  "
        ),
        title: "Success",
        description: "Welcome back admin",
      });

      router.replace("./");
      router.refresh();
    }
    setIsSubmitting(false);
    form.reset();
  };
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="background-light900_dark300 flex min-h-[400px] w-full max-w-[800px] flex-col items-center justify-between gap-2 space-y-8  self-center rounded-lg p-12 shadow-lg"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="group/form  flex min-w-[0.5vw] flex-row items-center gap-4">
              <FormLabel className="text-dark400_light800 font-noto_sans text-[1.30rem] font-bold group-focus-within/form:hidden">
                Username
              </FormLabel>
              <FormControl>
                <Input
                  autoComplete="off"
                  {...field}
                  className="no-focus paragraph-regular  min-h-[56px] max-w-[400px] border-2 border-purple-400 bg-slate-500 font-noto_sans font-bold text-white group-focus-within/form:scale-105 dark:bg-white dark:text-black"
                />
              </FormControl>
              <Image
                src="/assets/icons/shield.svg"
                width={40}
                height={30}
                alt={"something"}
              />
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem className="group/form  flex min-w-[0.5vw] flex-row items-center gap-4">
              <FormLabel className="text-dark400_light800 font-noto_sans text-[1.30rem] font-bold group-focus-within/form:hidden">
                Password
              </FormLabel>
              <FormControl>
                <Input
                  className="no-focus paragraph-regular  min-h-[56px] max-w-[400px] border-2 border-purple-400 bg-slate-500 font-noto_sans font-bold text-white group-focus-within/form:scale-105 dark:bg-white dark:text-black"
                  type="password"
                  {...field}
                />
              </FormControl>
              <Image
                src="/assets/icons/lock.svg"
                width={30}
                height={30}
                alt={"something"}
              />
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="  text-dark200_light900 min-h-[50px] min-w-[130px] justify-self-end border-2 border-purple-500 bg-amber-200 p-4 font-noto_sans text-lg font-bold hover:scale-105 hover:animate-pulse dark:bg-stone-800"
          disabled={isSubmitting}
        >
          {isSubmitting ? <>{"Αναμονή"}</> : <>{"ΣΥΝΔΕΣΗ"}</>}
        </Button>
      </form>
    </Form>
  );
};

export default LogInForm;
