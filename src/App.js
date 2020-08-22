/* eslint import/no-webpack-loader-syntax: off */
import React, { useEffect, useState } from "react";
import { Chart } from "react-chartjs-2";
import { utc } from "moment";
import { DEMOLOG, FPSLOG } from "./log";
import "chartjs-plugin-colorschemes/src/plugins/plugin.colorschemes";
import ChartDataLabels from "chartjs-plugin-datalabels";
import BudgetBurndown from "./components/charts/budgetDurndown";
import PlayerTable from "./components/charts/playerTable";
import ScoreLineChart from "./components/charts/scoreLineChart";
import DominationTime from "./components/charts/dominationTime";
import "hammerjs";
import "chartjs-plugin-zoom";
import { parseFps, parseLog } from "./data/logParse";
import PerformanceOverTime from "./components/charts/performanceOverTime";
import PerformancePlayerBar from "./components/charts/performancePlayerBar";
import LeftDrawer from "./components/leftDrawer";
import { ThemeProvider, useTheme } from "@material-ui/core/styles";
import Toolbar from "@material-ui/core/Toolbar";
import CssBaseline from "@material-ui/core/CssBaseline";
import { useStyles } from "./styles";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import TopAppBar from "./components/topAppBar";
import NotFoundPage from "./components/notFoundPage";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";

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

  useEffect(() => {
    Promise.all([
      parseLog(DEMOLOG).then(
        ({
          scoreDatasets,
          dominationDatasets,
          budgetDatasets,
          playerStats,
        }) => {
          setScoreDatasets(scoreDatasets);
          setDominationDatasets(dominationDatasets);
          setBudgetDatasets(budgetDatasets);
          setPlayerStats(playerStats);
        }
      ),
      parseFps(FPSLOG).then(
        ({ performanceDatasets, performanceBarDatasets }) => {
          setPerformanceDatasets(performanceDatasets);
          setPerformanceBarDatasets(performanceBarDatasets);
        }
      ),
    ]).then(() => setLoading(false));
  }, []);
  const theme = useTheme();
  const classes = useStyles();

  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <div className={classes.root}>
          <CssBaseline />
          <TopAppBar />
          <LeftDrawer />
          <Backdrop className={classes.backdrop} open={loading}>
            <CircularProgress color={"secondary"} />
          </Backdrop>
          <main className={classes.main}>
            <Toolbar />
            <Routes>
              <Route path="statistic">
                <Route
                  path="player-table"
                  element={<PlayerTable playerStats={playerStats} />}
                />
                <Route
                  path="performance"
                  element={
                    <>
                      <PerformancePlayerBar
                        datasets={performanceBarDatasets}
                        labels={performanceDatasets.map((d) => d.label)}
                      />
                      <PerformanceOverTime datasets={performanceDatasets} />
                    </>
                  }
                />
                <Route
                  path="economy"
                  element={<BudgetBurndown datasets={budgetDatasets} />}
                />
                <Route
                  path="campaign-score"
                  element={
                    <>
                      <ScoreLineChart datasets={scoreDatasets} />
                      <DominationTime datasets={dominationDatasets} />
                    </>
                  }
                />
              </Route>
              <Route path="*">
                <NotFoundPage />
              </Route>
            </Routes>
          </main>
        </div>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
