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
import ReferenceCommand from "../shared/reference/ReferenceCommand";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
const ClientStages = ({ clients }: any) => {
  const [stage, setStage] = useState(25);
  const [client, setClient] = useState<any>({});
  const [dogs, setDogs] = useState<any>([]);
  const [isTraining, setIsTraining] = useState(false);
  const [number, setNumber] = useState("");
  const [reference, setReference] = useState<any>();
  const [referenceChoice, setReferenceChoice] = useState<any>("");
  const { toast } = useToast();
  const [isCreating, setIsCreating] = useState(false);
  const [selectedClient, setSelectedClient] = useState<any>({});
  const handleCreate = async () => {
    setIsCreating(true);
    try {
      const newClient = await CreateClient({
        clientData: { ...client, referenceChoice, isTraining },
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
    <>
      <Progress
        value={stage}
        className="sticky  left-0 top-0 w-full shadow-lg shadow-orange-500"
      />
      {stage === 25 && (
        <div className="flex flex-col gap-8 ">
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
        <div className="flex h-full flex-col gap-2 lg:max-h-[900px] 2xl:max-h-[1100px]">
          <div className="flex flex-row items-center justify-center gap-8 2xl:mt-20"></div>
          <ClientForm setStage={setStage} setClient={setClient} />
        </div>
      )}

      {stage === 55 && (
        <div className="mt-20 flex flex-col items-center justify-center gap-8">
          <h1 className=" text-center font-noto_sans text-[24px] font-bold">
            Απο που βρήκε το κατάστημα μας;
          </h1>
          <Select
            onValueChange={(value) => {
              setReference(value);
              switch (value) {
                case "client":
                  setReferenceChoice({ clientId: null });
                  break;
                case "google":
                  setReferenceChoice({ google: true });
                  break;
                case "other":
                  setReferenceChoice({ other: "" });
                  break;
                default:
                  break;
              }
            }}
          >
            <SelectTrigger className="background-light800_dark300 text-dark300_light700 paragraph-regular light-border-2 min-h-[56px] max-w-[246px] rounded-lg p-2 font-noto_sans font-bold">
              <SelectValue placeholder="Σύσταση" />
            </SelectTrigger>
            <SelectContent className="background-light900_dark300 text-dark300_light700 rounded-lg p-4 font-noto_sans font-bold ">
              <SelectItem
                className={`rounded-lg hover:bg-sky-blue  `}
                value="client"
              >
                Πελάτης
              </SelectItem>
              <SelectItem
                className={`rounded-lg hover:bg-sky-blue  `}
                value="google"
              >
                Google
              </SelectItem>
              <SelectItem
                className={`rounded-lg hover:bg-sky-blue  `}
                value="other"
              >
                Άλλο
              </SelectItem>
            </SelectContent>
          </Select>
          {reference === "client" && (
            <ReferenceCommand
              clients={clients}
              selectedClient={selectedClient}
              setSelectedClient={setSelectedClient}
            />
          )}
          {reference === "other" && (
            <Input
              type="text"
              value={referenceChoice.other}
              onChange={(e) => {
                setReferenceChoice({ other: e.target.value });
              }}
              className="no-focus  background-light900_dark300 text-dark300_light700 paragraph-regular light-border-2 form_input max-w-[200px]"
            />
          )}
          <div className="flex flex-row items-center justify-center gap-8">
            <Button
              className="   self-center bg-red-dark  font-noto_sans text-[18px] font-extrabold text-white hover:scale-105 hover:animate-pulse"
              onClick={() => {
                setStage(50);
              }}
            >
              {" "}
              ΠΙΣΩ
            </Button>
            <Button
              className="bg-primary-500 font-noto_sans text-[18px] font-extrabold text-black hover:scale-105 hover:animate-pulse"
              onClick={() => setStage(60)}
              disabled={!referenceChoice}
            >
              ΕΠΟΜΕΝΟ
            </Button>
          </div>
        </div>
      )}
      {stage === 60 && (
        <div className="mt-20 flex flex-row items-center justify-center  gap-8">
          <span className="base-medium">Ενδιαφέρεται για εκπαίδευση;</span>
          <Select
            onValueChange={(value) => {
              if (value === "true") {
                setIsTraining(true);
              } else {
                setIsTraining(false);
              }
            }}
          >
            <SelectTrigger className="background-light800_dark300 text-dark300_light700 paragraph-regular light-border-2 min-h-[56px] max-w-[150px] rounded-lg p-2 font-noto_sans font-bold">
              <SelectValue placeholder="Εκπαίδευση" />
            </SelectTrigger>
            <SelectContent className="background-light900_dark300 text-dark300_light700 rounded-lg p-4 font-noto_sans font-bold ">
              <SelectItem
                className={`rounded-lg hover:bg-sky-blue  `}
                value={"true"}
              >
                Ναι
              </SelectItem>
              <SelectItem
                className={`rounded-lg hover:bg-sky-blue  `}
                value={"false"}
              >
                Όχι
              </SelectItem>
            </SelectContent>
          </Select>
          <Button
            className="   self-center bg-red-dark  font-noto_sans text-[18px] font-extrabold text-white hover:scale-105 hover:animate-pulse"
            onClick={() => {
              setStage(55);
            }}
          >
            {" "}
            ΠΙΣΩ
          </Button>
          <Button
            className="max-w-[200px] self-center bg-primary-500 font-noto_sans font-extrabold text-black hover:scale-105 hover:animate-pulse"
            onClick={() => setStage(65)}
          >
            ΕΠΟΜΕΝΟ
          </Button>
        </div>
      )}

      {stage === 65 && (
        <div className="mt-20 flex flex-row items-center justify-center gap-8">
          <h1 className="base-medium">Ποσα σκυλιά εχει ο πελάτης;</h1>
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
        <div className="mt-12 flex h-full flex-col  gap-2">
          <h1 className="text-center font-noto_sans text-[40px]">
            {" "}
            Σχεδόν ολοκληρώσαμε την διαδικασία εγγραφής
          </h1>
          <Table className="background-light800_darkgradient  mt-12 font-noto_sans text-lg font-bold">
            <TableCaption>Τα στοιχέια του πελάτη</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[300px]">ΟΝΟΜΑΤΕΠΩΝΥΜΟ</TableHead>
                <TableHead className="text-center">Email</TableHead>
                <TableHead>Σκύλοι</TableHead>
                <TableHead className="text-center">Πόλη</TableHead>
                <TableHead className="text-center">Διεύθυνση</TableHead>
                <TableHead className="text-center">Κατοικία</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">
                  {client?.firstName} {client?.lastName}
                </TableCell>
                <TableCell className="text-center">{client?.email}</TableCell>
                <TableCell className="flex flex-col">
                  {dogs?.dogs?.map((dog: any) => (
                    <span key={dog._id}> {dog.name} </span>
                  ))}
                </TableCell>
                <TableCell className="text-center">{client?.city}</TableCell>
                <TableCell className="text-center">{client?.address}</TableCell>
                <TableCell className="text-center">
                  {client.residence}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
          <Table className="background-light800_darkgradient  font-noto_sans text-lg font-bold">
            <TableHeader>
              <TableRow>
                <TableHead className="w-[300px]">Επάγγελμα</TableHead>
                <TableHead className="text-center"> Κινητό</TableHead>
                <TableHead className="text-center">Έκτακτη Επαφή</TableHead>
                <TableHead className="text-center">Τηλ.Οικίας</TableHead>
                <TableHead className="text-center">Τηλέφωνο Εργασίας</TableHead>
                <TableHead className="text-center">Κτηνίατρος</TableHead>
                <TableHead className="text-center">Τήλ.Κτην.</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">
                  {client?.profession}
                </TableCell>
                <TableCell className="text-center">{client?.mobile}</TableCell>
                <TableCell className="text-center">
                  {client?.emergencyContact}
                </TableCell>
                <TableCell className="text-center">
                  {client?.telephone}
                </TableCell>
                <TableCell className="text-center">
                  {client?.workMobile}
                </TableCell>
                <TableCell className="text-center">{client?.vet}</TableCell>
                <TableCell className="text-center">
                  {client?.vetNumber}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
          <div className="mt-20 flex flex-row items-center gap-8 self-center">
            <Button
              className="  min-h-[60px] min-w-[150px] max-w-[230px] self-center bg-red-dark py-6 font-noto_sans text-[20px] font-extrabold text-white hover:scale-105 hover:animate-pulse"
              onClick={() => setStage(75)}
            >
              {" "}
              ΠΙΣΩ
            </Button>
            <Button
              className="min-h-[60px] max-w-[230px] self-center bg-primary-500 font-noto_sans text-[20px] font-extrabold text-white hover:scale-105 hover:animate-pulse"
              onClick={handleCreate}
            >
              {" "}
              {isCreating ? <>{"Αναμονή"}</> : <>{"ΚΑΤΑΧΩΡΗΣΗ"}</>}
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default ClientStages;
