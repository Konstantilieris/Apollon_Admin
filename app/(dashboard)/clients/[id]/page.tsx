import AddDog from "@/components/clientProfile/Dog/AddDog";
import ClientInfoCard from "@/components/clientProfile/ClientInfoCard";
import { ClientNoteCard } from "@/components/clientProfile/ClientNoteCard";

import { DogCards } from "@/components/clientProfile/Dog/DogCard";
import { DeadDogTooltip } from "@/components/ui/deadDogTooltip";
import { getClientById } from "@/lib/actions/client.action";

import React from "react";

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
  const phonelist = [
    [
      {
        key: "ΣΤΑΘΕΡΟ: ",
        value: client?.phone?.telephone ? client?.phone.telephone : "N/A",
      },
      {
        key: "ΚΙΝΗΤΟ: ",
        value: client?.phone?.mobile ? client?.phone.mobile : "N/A",
      },
    ],
    [
      {
        key: "ΤΗΛ.ΕΡΓΑΣΙΑΣ: ",
        value: client?.phone?.contact ? client?.phone.work_phone : "N/A",
      },
      {
        key: "ΕΚΤΑΚΤΗ ΕΠΑΦΗ: ",
        value: client?.phone?.partner ? client?.phone.emergencyContact : "N/A",
      },
    ],
  ];
  const locationlist = [
    [
      {
        key: "ΠΕΡΙΟΧΗ: ",
        value: client?.location?.city ? client?.location.city : "N/A",
      },
      {
        key: "ΔΙΕΥΘΥΝΣΗ: ",
        value: client?.location?.address ? client?.location.address : "N/A",
      },
    ],
    [
      {
        key: "ΤΚ: ",
        value: client?.location?.postalCode
          ? client?.location.postalCode
          : "N/A",
      },
      {
        key: "ΤΥΠΟΣ ΚΑΤΟΙΚΙΑΣ: ",
        value: client?.location.residence ? client?.location.residence : "N/A",
      },
    ],
  ];
  const vetlist = [
    [
      { key: "ΟΝΟΜΑ: ", value: client?.vet.name ? client?.vet.name : "N/A" },
      {
        key: "ΤΗΛΕΦΩΝΟ: ",
        value: client?.vet.phone ? client?.vet.phone : "N/A",
      },
    ],
  ];

  return (
    <div className="relative flex h-full w-full flex-row justify-between gap-1 py-4 max-md:flex-col">
      <div className="ml-4   flex w-full   flex-col items-start gap-4 ">
        <ClientNoteCard client={JSON.parse(JSON.stringify(client))} />
        <ClientInfoCard
          title="ΣΤΟΙΧΕΙΑ ΕΠΙΚΟΙΝΩΝΙΑΣ"
          iconRight="/assets/icons/phone.svg"
          infolist={phonelist}
        />
        <ClientInfoCard
          title="ΣΤΟΙΧΕΙΑ ΚΑΤΟΙΚΙΑΣ"
          iconRight="/assets/icons/location.svg"
          infolist={locationlist}
          iconStyle="dark:invert"
        />
        <ClientInfoCard
          title="ΚΤΗΝΙΑΤΡΙΚΑ ΣΤΟΙΧΕΙΑ"
          iconRight="/assets/icons/vet.svg"
          infolist={vetlist}
          isVet={true}
        />
      </div>
      <div className="flex h-full w-full flex-col gap-4 rounded-2xl bg-neutral-800 px-4 py-2">
        <h1 className="font-sans text-2xl font-semibold text-indigo-300">
          ΚΑΤΟΙΚΙΔΙΑ ΠΕΛΑΤΗ{" "}
        </h1>
        <AddDog clientId={JSON.parse(JSON.stringify(client._id))} />

        <DogCards
          dogs={JSON.parse(JSON.stringify(livingDogs))}
          clientId={JSON.parse(JSON.stringify(client._id))}
        />
        <div className="mb-8 flex min-h-[5rem] w-full  flex-row items-center gap-12  rounded-xl bg-neutral-900 px-4 py-2">
          {deadDogs.length > 0 && <DeadDogTooltip items={deadDogs} />}
        </div>
      </div>
    </div>
  );
};

export default page;
