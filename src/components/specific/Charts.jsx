import {
  ArcElement,
  CategoryScale,
  Chart as ChartjJS,
  Filler,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Tooltip,
} from "chart.js";
import React from "react";
import { Doughnut, Line } from "react-chartjs-2";
import { lightBlue, lightViolet, violet } from "../../constants/color";
import { getLast7Days } from "../../lib/features";

ChartjJS.register(
  CategoryScale,
  Tooltip,
  Filler,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Legend
);

const labels = getLast7Days();

const linearChartOptions = {
  resposive: true,
  plugins: {
    legend: {
      display: false,
    },
    title: {
      display: false,
    },
  },
  scales: {
    x: {
      grid: {
        display: false,
      },
    },
    y: {
      beginAtZero: true,
      grid: {
        display: false,
      },
    },
  },
};

const LineChart = ({value = []}) => {
  const data = {
    labels: labels,
    datasets: [
      {
        data: value,
        label: "Messages",
        fill: false,
        backgroundColor: lightViolet,
        borderColor: violet,
      },
    ],
  };

  return <Line data={data} options={linearChartOptions} />;
};

/*
const DoughnutChartOptions = {
    resposive: true,
    plugins: {
        legend: {
            display: false,
        },
        title: {
            display: false,
        },
    },
    cutout: 120,
}; */

const DoughnutChart = ({value = [], labels = []}) => {
    const data = {
        //labels: labels,
        labels,
        datasets: [
          {
            data: value,
            backgroundColor: [violet, lightBlue],
            borderColor: [violet, lightBlue],
            offset: 45,
          },
        ],
      };
    return <Doughnut data={data}  style={{zIndex: 10}}/* options={DoughnutChartOptions} */ />;
};

export { DoughnutChart, LineChart };

