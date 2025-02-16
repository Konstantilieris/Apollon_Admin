// @ts-nocheck
"use client";
import React from "react";
import ClientForm from "../form/ClientForm";
import dynamic from "next/dynamic";
import { IClient } from "@/database/models/client.model";

const DynamicDogForm = dynamic(() => import("../form/DogForm"), { ssr: false });

const ClientRegistration = ({
  clients,
  professions,
  breeds,
  behaviors,
  foods,
}: {
  clients: any;
  professions: any;
  breeds: any;
  behaviors: any;
  foods: any;
}) => {
  const [stage, setStage] = React.useState(0);
  const [data, setData] = React.useState<Partial<IClient>>({});

  switch (stage) {
    case 0:
      return (
        <ClientForm
          setData={setData}
          setStage={setStage}
          clients={clients}
          professions={professions}
        />
      );
    case 1:
      return (
        <DynamicDogForm
          setStage={setStage}
          number={parseInt(data?.numberOfDogs)}
          client={data}
          breeds={breeds}
          behaviors={behaviors}
          foods={foods}
        />
      );

    default:
      return (
        <ClientForm setData={setData} setStage={setStage} clients={clients} />
      );
  }
};

export default ClientRegistration;
