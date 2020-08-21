import React from "react";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Bar } from "react-chartjs-2";

function PerformancePlayerBar({ datasets, labels }) {
  return (
    <Bar
      plugins={[ChartDataLabels]}
      data={{ datasets }}
      options={{
        title: {
          display: true,
          text: "Performance per Player",
        },
        tooltips: {
          position: "nearest",
          mode: "index",
          intersect: false,
        },
        scales: {
          xAxes: [
            {
              type: "category",
              labels,
            },
          ],
        },
        plugins: {
          datalabels: {
            formatter: Math.floor,
            anchor: "end",
            align: "start",
          },
        },
      }}
    />
  );
}

export default PerformancePlayerBar;
