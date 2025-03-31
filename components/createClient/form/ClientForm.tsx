"use client";
import React, { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Form, FormControl, FormField } from "@/components/ui/form";
import { Divider } from "@heroui/divider";
import { ClientValidation } from "@/lib/validation";
import * as z from "zod";
import { Input } from "@heroui/input";
import { RadioGroup, Radio } from "@heroui/radio";
import { Select, SelectItem } from "@heroui/select";

import { TypesOfResidence } from "@/constants";

import CommandMenuProvider from "@/components/shared/CommandMenu/CommandMenuProvider";
import { CommandMenuType } from "@/hooks/command-menu-store";
import ReferenceCommand2 from "@/components/shared/reference/ReferenceCommand2";
import { Button, Skeleton } from "@heroui/react";
import { getAllClientsByQuery } from "@/lib/actions/client.action";
const ClientForm = ({ setData, onChangePage }: any) => {
  const form = useForm<z.infer<typeof ClientValidation>>({
    resolver: zodResolver(ClientValidation),
    defaultValues: {
      name: "",
      email: "",
      profession: "",
      residence: "Διαμέρισμα",
      city: "",
      address: "",
      postalCode: "",
      mobile: "",
      telephone: "",
      emergencyContact: "",
      workMobile: "",
      vetName: "",
      vetNumber: "",
      vetWorkPhone: "",
      vetLocation: {
        city: "",
        address: "",
        postalCode: "",
      },
      numberOfDogs: "1",
    },
  });
  const [clients, setClients] = React.useState<any>([]);
  const [reference, setReference] = React.useState<any>({});
  const [loading, setLoading] = React.useState(false);
  useEffect(() => {
    const fetchClients = async () => {
      try {
        setLoading(true);

        const response = await getAllClientsByQuery();
        if (!response) return;
        const data = JSON.parse(response);
        setClients(data);
        setLoading(false);
      } catch (error) {
        console.error(error);
      }
    };
    fetchClients();
  }, []);
  async function onSubmit(values: z.infer<typeof ClientValidation>) {
    console.log("values", values);
    setData({ ...values, reference: { ...reference } });
    onChangePage([1, 2]);
    setReference(null);
    form.reset();
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mt-8 h-full flex-1 space-y-6"
      >
        <section className="w-full space-y-6 text-start">
          <h2 className="sub-header tracking-widest">Προσωπικά Στοιχεία</h2>
          <Divider />

          <div className="flex flex-row gap-6 max-lg:flex-col">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormControl>
                  <Input
                    {...field}
                    label="Όνομα"
                    variant="bordered"
                    color="secondary"
                    errorMessage="Το όνομα είναι υποχρεωτικό"
                    isInvalid={!field.value}
                    className="w-[30vw] max-lg:w-full"
                    isRequired
                    value={field.value}
                    onValueChange={field.onChange}
                  />
                </FormControl>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormControl>
                  <Input
                    {...field}
                    label="Email"
                    variant="bordered"
                    color="secondary"
                    className="w-[30vw] max-lg:w-full"
                    type="email"
                    value={field.value}
                    onValueChange={field.onChange}
                  />
                </FormControl>
              )}
            />
          </div>
          <div className="flex  w-full flex-row items-start gap-6 max-lg:flex-col ">
            <Skeleton isLoaded={!loading}>
              <ReferenceCommand2
                clients={clients}
                value={reference}
                onChange={setReference}
              />
            </Skeleton>
            <FormField
              control={form.control}
              name="profession"
              render={({ field }) => (
                <FormControl>
                  <CommandMenuProvider
                    isForm={true}
                    value={field.value}
                    onChange={field.onChange}
                    defaultMenuType={CommandMenuType.Professions}
                    disabled={true}
                  />
                </FormControl>
              )}
            />
          </div>
          <div className=" flex w-full flex-col items-start gap-6">
            <h2 className="sub-header tracking-widest ">
              Στοιχέια Επικοινωνίας
            </h2>
            <Divider />
            <div className="flex w-full flex-row  gap-6 max-lg:flex-col">
              <FormField
                control={form.control}
                name="mobile"
                render={({ field, fieldState }) => (
                  <FormControl>
                    <Input
                      {...field}
                      label="Κινητό"
                      isRequired
                      variant="bordered"
                      color="warning"
                      errorMessage="Το κινητό είναι υποχρεωτικό"
                      isInvalid={!field.value}
                      className="w-[30vw] max-lg:w-full"
                      value={field.value}
                      onValueChange={field.onChange}
                    />
                  </FormControl>
                )}
              />
              <FormField
                control={form.control}
                name="telephone"
                render={({ field }) => (
                  <FormControl>
                    <Input
                      {...field}
                      label="Σταθερό"
                      variant="bordered"
                      color="warning"
                      className="w-[30vw] max-lg:w-full"
                      value={field.value}
                      onValueChange={field.onChange}
                    />
                  </FormControl>
                )}
              />
            </div>
            <div className="flex w-full flex-row gap-6 max-lg:flex-col">
              <FormField
                control={form.control}
                name="workMobile"
                render={({ field }) => (
                  <FormControl>
                    <Input
                      {...field}
                      label="Κινητό Εργασίας"
                      variant="bordered"
                      color="warning"
                      className="w-[30vw] max-lg:w-full"
                      value={field.value}
                      onValueChange={field.onChange}
                    />
                  </FormControl>
                )}
              />
              <FormField
                control={form.control}
                name="emergencyContact"
                render={({ field }) => (
                  <FormControl>
                    <Input
                      {...field}
                      label="Έκτακτη Επαφή"
                      variant="bordered"
                      className="w-[30vw] max-lg:w-full"
                      color="warning"
                      value={field.value}
                      onValueChange={field.onChange}
                    />
                  </FormControl>
                )}
              />
            </div>
          </div>
        </section>
        <section className="space-y-6 text-start">
          <h2 className="sub-header tracking-widest">Στοιχεία Διεύθυνσης</h2>
          <Divider />
          <div className="flex flex-row gap-6 max-lg:flex-col">
            <FormField
              control={form.control}
              name="residence"
              render={({ field }) => (
                <FormControl>
                  <Select
                    {...field}
                    label="Τύπος Κατοικίας"
                    variant="bordered"
                    color="danger"
                    className="w-[30vw] max-lg:w-full"
                    classNames={{
                      value: "font-sans",
                      listbox: "font-sans tracking-wide text-xl",
                    }}
                    placeholder="Επιλέξτε"
                    selectedKeys={
                      field.value ? new Set([field.value]) : new Set()
                    }
                    // Whenever the user selects a new key, update form state
                    onSelectionChange={(keys: any) => {
                      // 'keys' is iterable. For single select, we take the first item.
                      const selectedKey = keys.values().next().value;
                      field.onChange(selectedKey);
                    }}
                  >
                    {TypesOfResidence.map((residence) => (
                      <SelectItem key={residence}>{residence}</SelectItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            />
            <FormField
              name="city"
              control={form.control}
              render={({ field }) => (
                <FormControl>
                  <Input
                    {...field}
                    color="danger"
                    label="Πόλη"
                    variant="bordered"
                    className="w-[30vw] max-lg:w-full"
                    value={field.value}
                    onValueChange={field.onChange}
                  />
                </FormControl>
              )}
            />
          </div>
          <div className="flex flex-row gap-6 max-lg:flex-col">
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormControl>
                  <Input
                    {...field}
                    label="Διεύθυνση"
                    variant="bordered"
                    color="danger"
                    className="w-[30vw] max-lg:w-full"
                    value={field.value}
                    onValueChange={field.onChange}
                  />
                </FormControl>
              )}
            />
            <FormField
              control={form.control}
              name="postalCode"
              render={({ field }) => (
                <FormControl>
                  <Input
                    {...field}
                    label="Ταχυδρομικός Κώδικας"
                    variant="bordered"
                    color="danger"
                    className="w-[30vw] max-lg:w-full"
                    value={field.value}
                    onValueChange={field.onChange}
                  />
                </FormControl>
              )}
            />
          </div>
        </section>
        <section className="space-y-6 text-start">
          {" "}
          <h2 className="sub-header tracking-widest">
            Στοιχεία Κτηνιάτρου Και Σκύλοι
          </h2>
          <Divider />
          <div className="flex flex-row gap-6 max-lg:flex-col">
            <FormField
              control={form.control}
              name="vetName"
              render={({ field }) => (
                <FormControl>
                  <Input
                    {...field}
                    label="Όνομα Κτηνίατρου"
                    variant="bordered"
                    color="success"
                    className="w-[30vw] max-lg:w-full"
                    value={field.value}
                    onValueChange={field.onChange}
                  />
                </FormControl>
              )}
            />
            <FormField
              control={form.control}
              name="vetNumber"
              render={({ field }) => (
                <FormControl>
                  <Input
                    {...field}
                    label="Τηλέφωνο Κτηνίατρου"
                    variant="bordered"
                    color="success"
                    className="w-[30vw] max-lg:w-full"
                    value={field.value}
                    onValueChange={field.onChange}
                  />
                </FormControl>
              )}
            />
          </div>
          <div className="flex flex-row gap-6 max-lg:flex-col">
            <FormField
              control={form.control}
              name="vetWorkPhone"
              render={({ field }) => (
                <FormControl>
                  <Input
                    {...field}
                    label="Τηλέφωνο Εργασίας Κτηνίατρου"
                    variant="bordered"
                    color="success"
                    className="w-[30vw] max-lg:w-full"
                    value={field.value}
                    onValueChange={field.onChange}
                  />
                </FormControl>
              )}
            />

            <FormField
              control={form.control}
              name="vetLocation.city"
              render={({ field }) => (
                <FormControl>
                  <Input
                    {...field}
                    label="Πόλη"
                    color="success"
                    variant="bordered"
                    className="w-[30vw] max-lg:w-full"
                    value={field.value}
                    onValueChange={field.onChange}
                  />
                </FormControl>
              )}
            />
          </div>
          <div className="flex flex-row gap-6 max-lg:flex-col">
            <FormField
              control={form.control}
              name="vetLocation.address"
              render={({ field }) => (
                <FormControl>
                  <Input
                    {...field}
                    label="Διεύθυνση"
                    variant="bordered"
                    color="success"
                    className="w-[30vw] max-lg:w-full"
                    value={field.value}
                    onValueChange={field.onChange}
                  />
                </FormControl>
              )}
            />
            <FormField
              control={form.control}
              name="vetLocation.postalCode"
              render={({ field }) => (
                <FormControl>
                  <Input
                    {...field}
                    label="Ταχυδρομικός Κώδικας"
                    variant="bordered"
                    className="w-[30vw] max-lg:w-full"
                    color="success"
                    value={field.value}
                    onValueChange={field.onChange}
                  />
                </FormControl>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name={`numberOfDogs`}
            render={({ field }) => (
              <FormControl>
                <RadioGroup
                  label="Αριθμός Σκύλων"
                  orientation="horizontal"
                  className="flex w-[30vw] flex-row gap-2  px-2 max-lg:w-full"
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  color="danger"
                >
                  {["1", "2", "3", "4", "5"].map((option, i) => (
                    <Radio value={option} key={i + option}>
                      {option}
                    </Radio>
                  ))}
                </RadioGroup>
              </FormControl>
            )}
          />
        </section>
        <div className="flex w-full max-lg:items-center max-lg:justify-center">
          <Button
            size="lg"
            type="submit"
            variant="faded"
            color="success"
            className="min-w-[10vw] tracking-widest max-lg:w-full"
          >
            ΕΠΟΜΕΝΟ
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ClientForm;
