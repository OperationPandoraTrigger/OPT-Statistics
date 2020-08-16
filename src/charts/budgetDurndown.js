import React from "react";
import { Line } from "react-chartjs-2";
import { GAMETIME_SCALE, LINE_TOOLTIP } from "../App";

function BudgetBurndown({ datasets }) {
  return (
    <Line
      data={{ datasets }}
      options={{
        title: {
          display: true,
          text: "Fraktionenbudget",
        },
        tooltips: LINE_TOOLTIP,
        scales: {
          xAxes: [GAMETIME_SCALE],
        },
        responsive: true,
        pan: {
          enabled: true,
          mode: "x",
          speed: 1,
          threshold: 2,
          rangeMax: {
            // Format of max pan range depends on scale type
            x: null,
            y: null,
          },
        },
        zoom: {
          enabled: true,
          mode: "xy",
        },
      }}
    />
  );
}

export default BudgetBurndown;
