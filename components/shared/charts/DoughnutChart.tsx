"use client";
import React from "react";

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { ExpendsLabel } from "@/lib/utils";
import { mainCategoryColors } from "@/constants";
const DoughnutChart = ({ total }: any) => {
  ChartJS.register(ArcElement, Tooltip, Legend);
  const labels = ExpendsLabel({ total });
  const data = {
    labels,
    datasets: [
      {
        data: total.map((item: any) => item.totalAmount),
        backgroundColor: [...mainCategoryColors],
        hoverOffset: 4,
      },
    ],
  };

  return (
    <Doughnut
      data={data}
      options={{
        cutout: "60%",
        plugins: {
          legend: {
            display: false,
          },
        },
      }}
    />
  );
};

export default DoughnutChart;
