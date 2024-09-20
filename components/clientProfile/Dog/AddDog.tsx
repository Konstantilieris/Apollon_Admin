"use client";
import React from "react";
import { IconDog, IconPlus } from "@tabler/icons-react";
import CreateDogModal from "./CreateDogModal";
const AddDog = ({ clientId }: { clientId: string }) => {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <span
        className="absolute right-4 top-6 flex cursor-pointer flex-row items-center gap-4 rounded-lg bg-dark-100 p-2 text-light-900 transition-transform duration-200 ease-in-out hover:scale-125 hover:text-green-500 "
        onClick={() => setOpen(true)}
      >
        <IconPlus className=" h-6 w-6   " />
        <IconDog className="h-6 w-6" />
      </span>
      {open && (
        <CreateDogModal isOpen={open} setOpen={setOpen} clientId={clientId} />
      )}
    </>
  );
};

export default AddDog;
