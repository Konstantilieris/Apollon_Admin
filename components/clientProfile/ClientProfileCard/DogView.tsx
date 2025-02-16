import React from "react";
import AddDog from "../Dog/AddDog";
import { DogCards } from "../Dog/DogCard";
import { DeadDogTooltip } from "@/components/ui/deadDogTooltip";

const DogView = ({ clientId, livingDogs, deadDogs }: any) => {
  return (
    <div className="relative flex w-full flex-col gap-4 rounded-2xl bg-dark-100  px-8 py-2">
      <h1 className="mt-2 self-center text-2xl font-semibold tracking-widest text-yellow-500">
        ΚΑΤΟΙΚΙΔΙΑ ΠΕΛΑΤΗ{" "}
      </h1>
      <AddDog clientId={JSON.parse(JSON.stringify(clientId))} />

      <DogCards
        dogs={JSON.parse(JSON.stringify(livingDogs))}
        clientId={JSON.parse(JSON.stringify(clientId))}
      />
      <div className="mb-8 flex min-h-[5rem] w-full  flex-row items-center justify-center gap-12  overflow-visible rounded-xl bg-neutral-900 px-4 py-2">
        {deadDogs.length > 0 && <DeadDogTooltip items={deadDogs} />}
      </div>
    </div>
  );
};

export default DogView;
