"use client";
import React from "react";
import { IconPlus } from "@tabler/icons-react";
import CreateDogModal from "./CreateDogModal";
const AddDog = ({ clientId }: { clientId: string }) => {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <IconPlus
        className="absolute right-4 top-6 h-5 w-5 cursor-pointer text-green-500 transition-transform duration-200 ease-in-out hover:scale-125"
        onClick={() => setOpen(true)}
      />
      {open && (
        <CreateDogModal isOpen={open} setOpen={setOpen} clientId={clientId} />
      )}
    </>
  );
};

export default AddDog;
