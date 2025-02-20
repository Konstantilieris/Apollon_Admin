import ClientInfoCard from "@/components/clientProfile/ClientInfoCard";
import { ClientNoteCard } from "@/components/clientProfile/ClientNoteCard";
import { getClientById } from "@/lib/actions/client.action";
import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import DogView from "@/components/clientProfile/ClientDog/DogView";
import { Separator } from "@/components/ui/separator";

const page = async ({ params }: { params: any }) => {
  const { id } = params;

  const client = await getClientById(id);
  if (!client) {
    return <div>No client Found</div>;
  }

  const livingDogs = client.dog.filter((dog: any) => dog.dead === false);
  const deadDogs = JSON.parse(
    JSON.stringify(client.dog.filter((dog: any) => dog.dead === true))
  );
  const dataList = [
    // Client Information Section
    {
      sectionTitle: "ΣΤΟΙΧΕΙΑ ΠΕΛΑΤΗ",
      iconRight: "/assets/icons/client.svg",
      items: [
        { key: "ΟΝΟΜΑ: ", value: client?.name },
        { key: "EMAIL: ", value: client?.email },
        { key: "ΕΠΑΓΓΕΛΜΑ: ", value: client?.profession },
      ],
    },

    // Phone Information Section
    {
      sectionTitle: "ΣΤΟΙΧΕΙΑ ΤΗΛΕΦΩΝΟΥ",
      iconRight: "/assets/icons/phone.svg",
      items: [
        { key: "ΣΤΑΘΕΡΟ: ", value: client?.phone?.telephone },
        { key: "ΚΙΝΗΤΟ: ", value: client?.phone?.mobile },
        { key: "ΤΗΛ.ΕΡΓΑΣΙΑΣ: ", value: client?.phone?.work_phone },
        { key: "ΕΚΤΑΚΤΗ ΕΠΑΦΗ: ", value: client?.phone?.emergencyContact },
      ],
    },

    // Location Information Section
    {
      sectionTitle: "ΣΤΟΙΧΕΙΑ ΔΙΕΥΘΥΝΣΗΣ",
      iconRight: "/assets/icons/location.svg",
      items: [
        { key: "ΠΕΡΙΟΧΗ: ", value: client?.location?.city },
        { key: "ΔΙΕΥΘΥΝΣΗ: ", value: client?.location?.address },
        { key: "ΤΚ: ", value: client?.location?.postalCode },
        { key: "ΤΥΠΟΣ ΚΑΤΟΙΚΙΑΣ: ", value: client?.location?.residence },
      ],
    },

    // Veterinarian Information Section
    {
      sectionTitle: "ΣΤΟΙΧΕΙΑ ΚΤΗΝΙΑΤΡΟΥ",
      iconRight: "/assets/icons/vet.svg",
      items: [
        { key: "ΟΝΟΜΑ: ", value: client?.vet?.name },
        { key: "ΤΗΛΕΦΩΝΟ: ", value: client?.vet?.phone },
        { key: "ΤΗΛ.ΕΡΓΑΣΙΑΣ: ", value: client?.vet?.work_phone },
        {
          key: "ΔΙΕΥΘΥΝΣΗ: ",
          value: client?.vet?.location
            ? `${client.vet.location.city}, ${client.vet.location.address}, ${client.vet.location.postalCode}`
            : "N/A",
        },
      ],
    },
  ];

  return (
    <ScrollArea className=" mb-20 h-full w-full">
      <div className=" relative  flex h-full w-full flex-row justify-between gap-1 py-4 max-md:flex-col">
        <div className="ml-4   flex h-full max-w-[50vw] flex-col items-start gap-4 ">
          <ClientInfoCard datalist={dataList} />

          <ClientNoteCard client={JSON.parse(JSON.stringify(client))} />
        </div>
        <div className="flex min-h-[80vh] w-full flex-row gap-2">
          <DogView
            clientId={client._id}
            livingDogs={livingDogs}
            deadDogs={deadDogs}
          />
          <div className="flex w-full flex-col gap-4 rounded-2xl bg-dark-100 px-4 py-2">
            <h1 className="text-2xl font-semibold text-yellow-500">
              Συστημένοι Πελάτες
            </h1>
            <ul className="list-disc pl-4 tracking-widest text-white">
              {client.references.hasReferenced?.length > 0 ? (
                client.references.hasReferenced.map(
                  (reference: any, index: number) => (
                    <>
                      <li key={reference._id} className="max-w-[350px]">
                        {reference.name}
                        <Separator className="bg-gray-500" />
                      </li>
                    </>
                  )
                )
              ) : (
                <li>Δεν υπάρχουν συστάσεις</li>
              )}
            </ul>
          </div>{" "}
          {/* This is the component that was added */}
        </div>
      </div>
    </ScrollArea>
  );
};

export default page;
