"use client";
import React from "react";
import { IconPlus } from "@tabler/icons-react";
import CreateDogModal from "./CreateDogModal";

const AddDog = ({ clientId }: { clientId: string }) => {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className=" mx-auto flex  items-center gap-2 rounded-2xl border-2 border-dashed border-neutral-800 bg-neutral-950 px-6 py-3 font-semibold uppercase text-light-900 transition-all duration-300 hover:translate-x-[-4px] hover:translate-y-[-4px] hover:rounded-md hover:shadow-[4px_4px_0px_black] active:translate-x-[0px] active:translate-y-[0px] active:rounded-2xl active:shadow-none"
      >
        <IconPlus size={20} /> Προσθηκη Κατοικιδιου
      </button>
      {open && (
        <CreateDogModal isOpen={open} setOpen={setOpen} clientId={clientId} />
      )}
    </>
  );
};

export default AddDog;
