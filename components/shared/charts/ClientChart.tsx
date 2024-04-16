"use client";
import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const ClientChart = ({ chartData }: any) => {
  const backgroundColors = ["#53D9D9", "#002B49", "#0067A0", "#FF5733"]; // Add more colors as needed
  const data = {
    labels: chartData.map((item: any) => item.month),
    datasets: [
      {
        label: "Πελάτες ανά μήνα",
        data: chartData.map((item: any) => item.count),
        backgroundColor: backgroundColors,
        borderWidth: 1,
      },
    ],
  };

  const options = {
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: "Μήνας",
        },
      },
      y: {
        display: true,
        title: {
          display: true,
          text: "Αριθμός Πελατών",
        },
        ticks: {
          stepSize: 4, // Set the step size to 4
          min: 0,
          max: 18, // Set the maximum value to 18
        },
      },
    },
    plugins: {
      legend: {
        display: true,
        position: "top" as const, // Change the position to one of the allowed values
      },
      title: {
        display: true,
        text: "Στατιστικά Πελατών ανά Μήνα",
      },
    },
  };

  return <Bar data={data} options={options} className="h-full w-full" />;
};

export default ClientChart;
