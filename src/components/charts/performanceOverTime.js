import React from "react";
import { Tableau20 } from "chartjs-plugin-colorschemes/src/colorschemes/colorschemes.tableau";
import { Line } from "react-chartjs-2";
import { LINE_TOOLTIP, GAMETIME_SCALE } from "../shared/statisticsProvider";

function PerformanceOverTime({ datasets }) {
  return (
    <Line
      data={{ datasets }}
      options={{
        title: {
          display: true,
          text: "Performance over Time",
        },
        plugins: {
          colorschemes: {
            scheme: Tableau20,
            fillAlpha: 0,
          },
        },
        tooltips: LINE_TOOLTIP,
        scales: {
          xAxes: [GAMETIME_SCALE],
        },
        trendlineLinear: {
          style: "rgba(255,105,180, 1)",
          lineStyle: "solid",
          width: 3,
        },
      }}
    />
  );
}

export default PerformanceOverTime;
