import React from "react";
import { utc } from "moment";
import { HorizontalBar } from "react-chartjs-2";
import { GAMETIME_SCALE} from "../shared/statisticsProvider";

function DominationTime({ datasets }) {
  return (
    <HorizontalBar
      data={{
        yLabels: [
          ...datasets.reduce((set, data) => set.add(data.stack), new Set()),
        ],
        datasets: datasets,
      }}
      options={{
        pan: {
          enabled: true,
          mode: "x",
          rangeMin: {
            x: GAMETIME_SCALE.ticks.min,
          },
          // rangeMax: {
          //     x: GAMETIME_SCALE.ticks.max * 2
          // },
        },
        zoom: {
          enabled: true,
          mode: "x",
          speed: 0.5,
          rangeMin: {
            x: GAMETIME_SCALE.ticks.min,
          },
          rangeMax: {
            x: GAMETIME_SCALE.ticks.max * 15,
          },
        },
        title: {
          display: true,
          text: "Fahnenbesitz",
        },
        legend: { display: false },
        tooltips: {
          mode: "nearest",
          position: "average",
          callbacks: {
            title: (tooltipItem, data) => {
              const { t } = data.datasets[tooltipItem[0].datasetIndex].data[
                tooltipItem[0].index
              ];
              return utc(t).format("HH:mm:ss");
            },
            footer: (tooltipItem, data) => {
              const { line } = data.datasets[tooltipItem[0].datasetIndex].data[
                tooltipItem[0].index
              ];
              return line;
            },
          },
          intersect: true,
        },
        scales: {
          xAxes: [
            {
              ...GAMETIME_SCALE,
              stacked: true,
            },
          ],
          yAxes: [
            {
              stacked: true,
            },
          ],
        },
      }}
    />
  );
}

export default DominationTime;
