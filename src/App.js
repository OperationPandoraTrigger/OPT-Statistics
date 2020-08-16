/* eslint import/no-webpack-loader-syntax: off */
import React, { useEffect, useState } from "react";
import "./App.css";
import { Chart } from "react-chartjs-2";
import { utc } from "moment";
import { DEMOLOG, FPSLOG } from "./log";
import { Typography } from "@material-ui/core";
import "chartjs-plugin-colorschemes/src/plugins/plugin.colorschemes";
import ChartDataLabels from "chartjs-plugin-datalabels";
import BudgetBurndown from "./charts/budgetDurndown";
import PlayerTable from "./charts/playerTable";
import ScoreLineChart from "./charts/scoreLineChart";
import DominationTime from "./charts/dominationTime";
import "hammerjs";
import "chartjs-plugin-zoom";
import { parseFps, parseLog } from "./data/logParse";
import PerformanceOverTime from "./charts/performanceOverTime";
import PerformancePlayerBar from "./charts/performancePlayerBar";

Chart.plugins.unregister(ChartDataLabels);

export const LINE_TOOLTIP = {
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
  position: "nearest",
  mode: "index",
  intersect: false,
};
export const GAMETIME_SCALE = {
  type: "linear",
  distribution: "linear",
  bounds: "data",
  stepSize: 1000 * 60 * 20, // 10min
  ticks: {
    callback: function (value) {
      return utc(value).format("HH:mm:ss");
    },
  },
};

function App() {
  const [loading, setLoading] = useState(true);
  const [scoreDatasets, setScoreDatasets] = useState([]);
  const [dominationDatasets, setDominationDatasets] = useState([]);
  const [budgetDatasets, setBudgetDatasets] = useState([]);
  const [performanceBarDatasets, setPerformanceBarDatasets] = useState([]);
  const [performanceDatasets, setPerformanceDatasets] = useState([]);
  const [playerStats, setPlayerStats] = useState({});

  const onUploadLog = (event) => {
    setLoading(true);
    event.target.files[0]
      .text()
      .then(parseLog)
      .then(() => setLoading(false));
  };
  useEffect(() => {
    parseLog(DEMOLOG).then(
      ({ scoreDatasets, dominationDatasets, budgetDatasets, playerStats }) => {
        setScoreDatasets(scoreDatasets);
        setDominationDatasets(dominationDatasets);
        setBudgetDatasets(budgetDatasets);
        setPlayerStats(playerStats);
      }
    );
    parseFps(FPSLOG).then(({ performanceDatasets, performanceBarDatasets }) => {
      setPerformanceDatasets(performanceDatasets);
      setPerformanceBarDatasets(performanceBarDatasets);
    });
    setLoading(false);
  }, []);

  return (
    <div className="App">
      <input disabled type="file" onChange={onUploadLog} />
      <Typography variant={"h1"}>
        Ernte Gut, alles Gut. Funschlacht 1.3
      </Typography>
      {!loading && (
        <>
          <PerformancePlayerBar
            datasets={performanceBarDatasets}
            labels={performanceDatasets.map((d) => d.label)}
          />
          <PerformanceOverTime datasets={performanceDatasets} />
          <DominationTime datasets={dominationDatasets} />
          <ScoreLineChart datasets={scoreDatasets} />
          <BudgetBurndown datasets={budgetDatasets} />
          <PlayerTable playerStats={playerStats} />
        </>
      )}
    </div>
  );
}

export default App;
