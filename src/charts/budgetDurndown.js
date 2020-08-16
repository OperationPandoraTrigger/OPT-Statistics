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
              mode: "xy",
              rangeMin: {
                  x: GAMETIME_SCALE.ticks.min,
                  y: -100000,
              },
              rangeMax: {
                  x: GAMETIME_SCALE.ticks.max * 2,
                  y: 6000000,
              },
          },
          zoom: {
              enabled: true,
              mode: "xy",
              speed: 0.5,
              rangeMin: {
                  x: GAMETIME_SCALE.ticks.min,
                  y: -500000,
              },
              rangeMax: {
                  x: GAMETIME_SCALE.ticks.max,
                  y: 4000000,
              },
          },
      }}
    />
  );
}

export default BudgetBurndown;
