import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dog } from "@/types";
import { Button, Divider } from "@heroui/react";
import { useModalStore } from "@/hooks/client-profile-store";
import { Icon } from "@iconify/react/dist/iconify.js";

const DogList = ({ clientId, dogs }: { clientId: string; dogs: Dog[] }) => {
  const { openModal } = useModalStore();
  return (
    <Card className=" ml-8 w-full border-0">
      <CardHeader className="mb-16 mt-1 flex flex-col gap-1 p-0">
        <div className="flex w-full flex-row items-center justify-between px-4">
          <CardTitle className="text-xl tracking-widest">
            Κατοικίδια Πελάτη
          </CardTitle>
          <Button
            color="success"
            variant="bordered"
            className="uppercase tracking-widest"
            onPress={() => openModal("createDog", { clientId })}
          >
            ΠΡΟΣΘΗΚΗ ΣΚΥΛΟΥ
          </Button>
        </div>
        <Divider className=" space-y-2" />
      </CardHeader>
      <CardContent>
        {dogs.map((dog, index) => (
          <div
            key={index}
            className="relative mb-4 space-y-2 rounded-xl bg-neutral-900/80 p-4"
          >
            <div className="flex flex-row items-center justify-between">
              <h3 className="flex-1 text-lg font-semibold uppercase tracking-widest">
                {dog.name}
              </h3>
              <span className="tracking-wide text-purple-600 underline underline-offset-4">
                {" "}
                {dog.microchip ?? ""}{" "}
              </span>
            </div>
            <p className="text-lg tracking-wide">Ράτσα: {dog.breed}</p>
            <p className="text-lg tracking-wide">
              Φύλο: {dog.gender === "male" ? "Αρσενικό" : "Θηλυκό"}
            </p>
            <p className="text-lg tracking-wide">
              Ηλικία:{" "}
              {new Date().getFullYear() - new Date(dog.birthdate).getFullYear()}{" "}
              ετών
            </p>
            <p className="text-lg tracking-wide">Βάρος: {dog.weight} kg</p>
            <p className="text-lg tracking-wide">
              Στειρωμένο: {dog.sterilized ? "Ναι" : "Όχι"}
            </p>
            <p className="text-lg tracking-wide">Συμπεριφορά: {dog.behavior}</p>
            <p className="text-lg tracking-wide">Τροφή: {dog.food}</p>
            <p className="text-lg tracking-wide">
              Σημείωση: {dog.note || "Καμία"}
            </p>
            <h4 className="mt-2 text-lg font-semibold tracking-widest">
              Ιατρικό Ιστορικό
            </h4>
            <ul className="list-disc pl-5">
              {dog.medicalHistory.length > 0 ? (
                dog.medicalHistory.map((record, idx) => (
                  <li key={idx}>
                    {record.illness} - Θεραπεία: {record.treatment.name} (
                    {record.treatment.frequency})
                  </li>
                ))
              ) : (
                <li>Δεν υπάρχει ιστορικό</li>
              )}
            </ul>
            <div className="absolute bottom-2 right-4 flex flex-row gap-2 ">
              <Button
                isIconOnly
                size="sm"
                variant="flat"
                onPress={() => {
                  openModal("editDog", { clientId, dog });
                }}
              >
                <Icon icon="lucide:edit" className="h-4 w-4" />
              </Button>
              <Button
                isIconOnly
                size="sm"
                color="danger"
                variant="flat"
                onPress={() => {}}
              >
                <Icon icon="lucide:trash" className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default DogList;
