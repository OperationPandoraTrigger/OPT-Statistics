import React from "react";
import { Line } from "react-chartjs-2";
import {LINE_TOOLTIP, GAMETIME_SCALE} from "../shared/statisticsProvider";


function ScoreLineChart({ datasets }) {
  return (
    <Line
      data={{ datasets }}
      options={{
        title: {
          display: true,
          text: "Punktestand",
        },
        tooltips: LINE_TOOLTIP,
        scales: {
          xAxes: [GAMETIME_SCALE],
        },
      }}
    />
  );
}

export default ScoreLineChart;
