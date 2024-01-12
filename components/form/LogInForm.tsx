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
import { revalidatePath } from "next/cache";
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
    }
    setIsSubmitting(false);
    form.reset();
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="flex   flex-col">
              <FormLabel className="text-dark400_light800 font-noto_sans text-lg font-bold">
                Username
              </FormLabel>
              <FormControl>
                <Input
                  autoComplete="off"
                  {...field}
                  className="no-focus  paragraph-regular background-light900_dark300 light-border-2 text-dark300_light700 min-h-[56px] max-w-[400px] border font-noto_sans"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem className="flex  min-w-[0.5vw] flex-col">
              <FormLabel className="text-dark400_light800 font-noto_sans text-lg font-bold">
                Password
              </FormLabel>
              <FormControl>
                <Input
                  className="no-focus paragraph-regular background-light900_dark300 light-border-2 text-dark300_light700 min-h-[56px] max-w-[400px] border"
                  type="password"
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="form-button w-fit font-noto_sans text-lg font-bold hover:scale-105"
          disabled={isSubmitting}
        >
          {isSubmitting ? <>{"Submitting"}</> : <>{"Submit"}</>}
        </Button>
      </form>
    </Form>
  );
};

export default LogInForm;
