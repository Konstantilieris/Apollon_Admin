"use client";
import React from "react";

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
const NewUsersCard = () => {
  ChartJS.register(ArcElement, Tooltip, Legend);
  const data = {
    labels: ["Old", "New Clients"],
    datasets: [
      {
        label: "# of Users",
        data: [12, 19],
        backgroundColor: ["rgba(54, 162, 235, 0.2)", "rgba(255, 206, 86, 0.2)"],
        borderColor: ["rgba(54, 162, 235, 1)", "rgba(255, 206, 86, 1)"],
        borderWidth: 1,
      },
    ],
  };
  return (
    <div className="card-wrapper text-dark200_light800  flex  w-full flex-col gap-4 rounded-lg p-4 font-noto_sans max-xs:min-w-full xs:w-[260px]">
      <div className="relative flex flex-col justify-between gap-2">
        <h1 className="font-noto_sans font-bold">New Clients</h1>
        <Doughnut data={data} />
        <h1 className="donut-text">45%</h1>
      </div>
    </div>
  );
};

export default NewUsersCard;
