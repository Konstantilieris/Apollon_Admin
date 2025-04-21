"use client";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { LogInValidation } from "@/lib/validation";
import * as z from "zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import Image from "next/image";
import { MagicInput } from "../ui/magic-input";
import { Label } from "../ui/magic-label";
import { Loader } from "lucide-react";

const LogInForm = () => {
  // eslint-disable-next-line no-unused-vars
  const router = useRouter();
  // eslint-disable-next-line no-unused-vars
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      toast.error("Λάθος όνομα χρήστη ή κωδικός πρόσβασης.");
    } else {
      toast.success("Σύνδεση επιτυχής.");

      router.replace("./");
      router.refresh();
    }
    setIsSubmitting(false);
    form.reset();
  };
  return (
    <section className="   flex   w-full  flex-col items-center gap-4 self-center px-4  max-sm:px-6">
      <div className="mb-8 flex flex-row items-center gap-3  text-[60px] font-bold dark:text-light-700">
        Apollon
        <Image
          src="/assets/icons/bone.svg"
          alt="asset"
          width={55}
          height={60}
          className="object-contain dark:invert"
        />
      </div>
      <h1 className="mb-8  text-center text-2xl font-semibold italic text-light-500">
        Συνδεθείτε με τα διαπιστευτήριά σας για να αποκτήσετε πρόσβαση στην
        εφαρμογή{" "}
      </h1>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-8"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="group/form  flex min-w-[0.5vw] flex-col gap-2">
                <Label className="flex flex-row items-center gap-2 text-xl">
                  <Image
                    src="/assets/icons/shield.svg"
                    width={40}
                    height={30}
                    alt={"something"}
                  />{" "}
                  Όνομα Χρήστη{" "}
                </Label>
                <FormControl className="max-w-[300px]">
                  <MagicInput
                    autoComplete="off"
                    {...field}
                    className="min-h-[50px] max-w-[400px]"
                  />
                </FormControl>

                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="group/form  flex min-w-[0.5vw] flex-col  gap-2">
                <Label className="flex flex-row items-center gap-2 text-xl">
                  <Image
                    src="/assets/icons/lock.svg"
                    width={30}
                    height={30}
                    alt={"something"}
                    className="mb-2"
                  />{" "}
                  Κωδικός Πρόσβασης{" "}
                </Label>
                <FormControl>
                  <MagicInput
                    {...field}
                    autoComplete={"false"}
                    type="password"
                    className="min-h-[50px] min-w-[300px] max-w-[400px]"
                  />
                </FormControl>

                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />
          <button
            className="group/btn relative  block h-14 w-full rounded-md bg-gradient-to-br from-black to-neutral-600 font-medium text-white shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:bg-zinc-800 dark:from-zinc-900 dark:to-zinc-900 dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
            type="submit"
          >
            {isSubmitting ? (
              <Loader className="mx-auto animate-spin" />
            ) : (
              <>Σύνδεση &rarr;</>
            )}
            <>
              <span className="absolute inset-x-0 -bottom-px block h-px w-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100" />
              <span className="absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 blur-sm transition duration-500 group-hover/btn:opacity-100" />
            </>
          </button>
        </form>
      </Form>
    </section>
  );
};

export default LogInForm;
