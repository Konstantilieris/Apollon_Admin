// @ts-nocheck
"use client";
import React from "react";
import ClientForm from "../form/ClientForm";
import dynamic from "next/dynamic";

const DynamicDogForm = dynamic(() => import("../form/DogForm"), { ssr: false });

const ClientRegistration = ({ clients }: { clients: any }) => {
  const [stage, setStage] = React.useState(0);
  const [data, setData] = React.useState();

  switch (stage) {
    case 0:
      return (
        <ClientForm setData={setData} setStage={setStage} clients={clients} />
      );
    case 1:
      return (
        <DynamicDogForm
          setStage={setStage}
          number={parseInt(data?.numberOfDogs)}
          client={data}
        />
      );

    default:
      return (
        <ClientForm setData={setData} setStage={setStage} clients={clients} />
      );
  }
};

export default ClientRegistration;
