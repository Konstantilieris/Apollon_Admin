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
  const backgroundColors = [
    "#53D9D9",
    "#002B49",
    "#0067A0",
    "#FF5733",
    "#FFC300",
    "#FF6F61",
    "#C70039",
    "#ADEFD1",
    "#FFD700",
    "#B39CD0",
    "#7FFFD4",
    "#FFA07A",
  ]; // Add more colors as needed
  const data = {
    labels: chartData.map((item: any) => item.month),

    datasets: [
      {
        label: "Πελάτες",
        data: chartData.map((item: any) => item.count),
        backgroundColor: backgroundColors,
        font: { size: 20 },
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    scales: {
      x: {
        display: true,

        title: {
          display: true,
          text: "Μήνας",
          font: {
            size: 20,
            style: "italic" as const,
          },
        },
        ticks: {
          font: {
            size: 20,
          },
          color: "#f54f02",
        },
      },
      y: {
        display: true,
        title: {
          display: true,
          text: "Αριθμός Πελατών",
          font: {
            size: 20,
            style: "italic" as const,
          },
        },

        ticks: {
          stepSize: 2, // Set the step size to 4
          min: 0,
          max: 18,
          font: {
            size: 20,
          },
          color: "#f54f02", // Set the maximum value to 18
        },
      },
    },
    plugins: {
      legend: {
        display: true,
        position: "top" as const,
        labels: {
          font: {
            size: 20,
            weight: "bold" as const,
          },
          color: "#03d1ff",
        },
        // Change the position to one of the allowed values
      },

      title: {
        display: true,
        text: "Στατιστικά Πελατών ανά Μήνα",
        font: {
          size: 20,
        },
        color: "#f54f02",
      },
    },
  };

  return <Bar data={data} options={options} className="h-full w-full" />;
};

export default ClientChart;
