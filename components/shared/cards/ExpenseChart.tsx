"use client";
import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
const ExpenseChart = ({ expense, totalSum }: any) => {
  ChartJS.register(ArcElement, Tooltip, Legend);
  const data = {
    labels: ["Συνολικά Έξοδα", `Eξοδα Κατηγορίας-${expense._id} `],
    datasets: [
      {
        label: "Μηνιαία Έξοδα",
        data: [totalSum[0].totalSum, expense.totalAmount],
        backgroundColor: ["rgba(54, 162, 235, 0.2)", "rgba(255, 206, 86, 0.2)"],
        borderColor: ["rgba(54, 162, 235, 1)", "rgba(255, 206, 86, 1)"],
        borderWidth: 1,
      },
    ],
  };
  const percentage = (
    (expense.totalAmount / totalSum[0].totalSum) *
    100
  ).toFixed(2);
  return (
    <div className="card-wrapper text-dark200_light800  flex  w-full min-w-[400px] flex-col gap-4 rounded-lg p-4 font-noto_sans max-xs:min-w-full xs:w-[260px]">
      <div className="relative flex flex-col justify-between gap-2">
        <h1 className="text-center font-noto_sans font-bold">
          ΕΞΟΔΑ-{expense._id}
        </h1>
        <h1 className="text-center font-noto_sans font-bold">
          ΓΙΑ ΤΟΝ ΜΗΝΑ :{" "}
          {new Date().toLocaleString("default", {
            month: "long",
          })}
        </h1>
        <Doughnut data={data} className="text-center text-lg" />
        <h1 className="donut-text font-bold text-purple-600">{percentage}%</h1>
      </div>
    </div>
  );
};
export default ExpenseChart;
