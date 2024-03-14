"use client";
import ClientForm from "@/components/form/ClientForm";
import Image from "next/image";
import React, { useState } from "react";
import { Progress } from "@/components/ui/progress";

import { Button } from "@/components/ui/button";
import DogForm from "@/components/form/DogForm";
import { CreateClient } from "@/lib/actions/client.action";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Pdf from "@/components/shared/Pdf";
const Page = () => {
  const [stage, setStage] = useState(25);
  const [client, setClient] = useState<any>({});
  const [dogs, setDogs] = useState<any>([]);
  const [number, setNumber] = useState("");
  const { toast } = useToast();
  const [isCreating, setIsCreating] = useState(false);

  const handleCreate = async () => {
    setIsCreating(true);
    try {
      const newClient = await CreateClient({
        clientData: client,
        dogs: dogs.dogs,
      });
      if (newClient) {
        toast({
          className: cn(
            "bg-celtic-green border-none text-white  font-noto_sans text-center flex flex-center max-w-[300px] bottom-0 left-0 fixed  "
          ),
          title: "Επιτυχία",
          description: "Ο πελάτης καταχωρήθηκε",
        });
      }
    } catch (error) {
      toast({
        className: cn(
          "bg-red-dark border-none text-white  font-noto_sans text-center flex flex-center max-w-[300px] bottom-0 left-0 fixed  "
        ),
        title: "Αποτυχία δημιουργίας",
        description: `${error}`,
      });
    } finally {
      setIsCreating(false);
      window.location.reload();
    }
  };

  return (
    <section className=" text-dark400_light700  flex h-full w-full flex-col ">
      <Progress value={stage} className="w-full  shadow-light-200" />
      {stage === 25 && (
        <div className="flex flex-col gap-8">
          <div className="mt-20 flex flex-row items-center justify-center gap-8">
            <h1 className=" text-center font-noto_sans text-[26px] font-bold">
              Ας ξεκινήσουμε τη διαδικασία εγγραφής του πελάτη{" "}
            </h1>
            <Pdf />
            <Button
              className="bg-primary-500 font-noto_sans font-extrabold text-black hover:scale-105 hover:animate-pulse"
              onClick={() => setStage(50)}
            >
              {" "}
              ΕΠΟΜΕΝΟ
            </Button>
          </div>
          <Image
            src={"/assets/images/clientForm.webp"}
            width={600}
            height={100}
            alt="dog client"
            className="self-center rounded-lg shadow-light-300"
          />
        </div>
      )}
      {stage === 50 && (
        <div className="flex flex-col gap-2">
          <div className="mt-20 flex flex-row items-center justify-center gap-8">
            <h1 className=" text-center font-noto_sans text-[24px] font-bold">
              Παρακαλούμε δώστε τα προσωπικά στοιχεία του πελάτη για να
              συνεχίσετε
            </h1>
          </div>
          <ClientForm setStage={setStage} setClient={setClient} />
        </div>
      )}

      {stage === 65 && (
        <div className="flex flex-col gap-2">
          <div className="mt-20 flex flex-row items-center justify-center gap-8">
            <h1 className=" text-center font-noto_sans text-[24px] font-bold">
              Ποσα σκυλιά εχει ο πελάτης;
            </h1>
            <Input
              type="number"
              value={number}
              onChange={(e) => {
                setNumber(e.target.value);
              }}
              className="no-focus  background-light900_dark300 text-dark300_light700 paragraph-regular light-border-2 form_input max-w-[200px]"
            />

            <Button
              className="bg-primary-500 font-noto_sans font-extrabold text-black hover:scale-105 hover:animate-pulse"
              onClick={() => setStage(75)}
              disabled={parseInt(number) === 0 || !number}
            >
              {" "}
              ΕΠΟΜΕΝΟ
            </Button>
          </div>
        </div>
      )}
      {stage === 75 && (
        <div className="flex flex-col gap-2">
          <div className="mt-20 flex flex-row items-center justify-center gap-8">
            <h1 className=" text-center font-noto_sans text-[24px] font-bold">
              Παρακαλούμε δώστε τα στοιχεία των σκύλων για να συνεχίσετε
            </h1>
          </div>
          <DogForm
            setStage={setStage}
            setDogs={setDogs}
            number={parseInt(number)}
          />
        </div>
      )}
      {stage === 100 && (
        <div className="mt-12 flex flex-col gap-2">
          <h1 className="text-center font-noto_sans text-[40px]">
            {" "}
            Σχεδόν ολοκληρώσαμε την διαδικασία εγγραφής
          </h1>
          <Table className="background-light800_darkgradient  font-noto_sans text-lg font-bold">
            <TableCaption>Τα στοιχέια του πελάτη</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[300px]">ΟΝΟΜΑΤΕΠΩΝΥΜΟ</TableHead>
                <TableHead className="text-center">Email</TableHead>
                <TableHead>Σκύλοι</TableHead>
                <TableHead className="text-right">Διεύθυνση</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">
                  {client?.firstName} {client?.lastName}
                </TableCell>
                <TableCell className="text-center">{client.email}</TableCell>
                <TableCell>
                  {dogs?.dogs?.map((dog: any) => dog.name).join(", ")}
                </TableCell>
                <TableCell className="text-right">{client.address}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
          <div className="flex flex-row items-center gap-8 self-center">
            <Button
              className="  min-h-[60px] min-w-[150px] max-w-[230px] self-center bg-red-dark py-6 font-noto_sans text-[20px] font-extrabold text-white hover:scale-105 hover:animate-pulse"
              onClick={() => setStage(75)}
            >
              {" "}
              ΠΙΣΩ
            </Button>
            <Button
              className="min-h-[60px] max-w-[230px] self-center bg-primary-500 font-noto_sans text-[20px] font-extrabold text-black hover:scale-105 hover:animate-pulse"
              onClick={handleCreate}
            >
              {" "}
              {isCreating ? <>{"Submitting"}</> : <>{"Submit"}</>}
            </Button>
          </div>
        </div>
      )}
    </section>
  );
};

export default Page;
