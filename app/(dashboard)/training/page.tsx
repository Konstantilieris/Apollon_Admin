"use client";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { getAllClientsByQuery } from "@/lib/actions/client.action";
import { replacePercent20 } from "@/lib/utils";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { getAllTrainings } from "@/lib/actions/training.action";
import { DataTable } from "@/components/dataTable/clientsTable/data-table";
import { trainingColumns } from "@/components/dataTable/trainingTable/TrainingColumns";
const DynamicTrainingForm = dynamic(
  () => import("@/components/form/TrainingForm"),
  {
    ssr: false,
  }
);
const Page = () => {
  const [clients, setClients] = useState<any>();
  const [training, setTraining] = useState<any>();
  const [openForm, setOpenForm] = useState(false);
  const searchParams = useSearchParams();
  useEffect(() => {
    const searchQuery = replacePercent20(searchParams.get("q"));

    const fetchData = async () => {
      try {
        // Call getAllRoomsAndBookings and wait for the result
        const clientsData = await getAllClientsByQuery(searchQuery);
        setClients(JSON.parse(clientsData));
      } catch (error) {
        console.error("Error fetching rooms:", error);
      }
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams.get("q")]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const allData = await getAllTrainings();
        setTraining(allData);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };
    fetchData();
  }, []);

  return (
    <section className="flex h-full w-full flex-col items-center p-8">
      {!openForm && (
        <div className="text-dark200_light800 flex flex-row items-center gap-4 self-start font-noto_sans text-lg">
          <h1 className="flex flex-row gap-2">
            Με λιγα κλικ καταχώρησε ραντεβου{" "}
            <Image
              src={"/assets/icons/arrow-right.svg"}
              alt="arrow-right"
              width={20}
              height={20}
            />
          </h1>
          <Button
            onClick={() => setOpenForm(!openForm)}
            className="btn text-dark500_light700  border-2 border-pink-800 p-4 font-noto_sans text-lg font-bold hover:scale-105 hover:animate-pulse"
          >
            ΡΑΝΤΕΒΟΥ
          </Button>
        </div>
      )}
      {openForm && clients && (
        <DynamicTrainingForm clients={clients} setOpenForm={setOpenForm} />
      )}
      <div className="mt-12 h-full  w-full">
        {!openForm && training && (
          <>
            {" "}
            <h1 className="text-light850_dark500 font-noto_sans text-[30px] font-extrabold">
              {" "}
              ΠΙΝΑΚΑΣ ΕΚΠΑΙΔΕΥΣΕΩΝ
            </h1>
            <DataTable data={training} columns={trainingColumns} />
          </>
        )}
      </div>
    </section>
  );
};

export default Page;
