"use client";
import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { ExpendsLabel } from "@/lib/utils";

const ExpenseChart = ({ categories }: any) => {
  const labels = ExpendsLabel({ categories: categories.totalAmountByCategory });
  ChartJS.register(ArcElement, Tooltip, Legend);
  const data = {
    labels: [...labels],
    datasets: [
      {
        data: [
          ...categories.totalAmountByCategory.map(
            (item: any) => item.totalAmount
          ),
        ],
        label: "Μηνιαία Έξοδα",

        backgroundColor: [
          ...categories.totalAmountByCategory.map((item: any) => item.color),
        ],
        borderColor: [
          ...categories.totalAmountByCategory.map((item: any) => item.color),
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="card-wrapper text-dark200_light800  mt-36 flex max-h-[800px] w-full min-w-[400px] flex-col gap-4 rounded-lg p-4  font-noto_sans max-xs:min-w-full xs:w-[260px]">
      <div className="relative flex flex-col justify-between gap-2">
        <h1 className="text-center font-noto_sans font-bold">
          ΣΥΝΟΛΙΚΑ ΕΞΟΔΑ-{categories.totalSumFromAllCategories[0].totalSum} €
        </h1>
        <h1 className="text-center font-noto_sans font-bold">
          ΓΙΑ ΤΟΝ ΜΗΝΑ :{" "}
          {new Date().toLocaleString("default", {
            month: "long",
          })}
        </h1>
        <Doughnut
          data={data}
          className="text-center font-noto_sans text-lg font-bold text-white"
        />
      </div>
    </div>
  );
};
export default ExpenseChart;
