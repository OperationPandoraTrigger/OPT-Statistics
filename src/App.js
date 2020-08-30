/* eslint import/no-webpack-loader-syntax: off */
import React, { useEffect, useState } from "react";
import { Chart } from "react-chartjs-2";
import { utc } from "moment";
import { FPSLOG } from "./devLogs/rosche_1_3";
import "chartjs-plugin-colorschemes/src/plugins/plugin.colorschemes";
import ChartDataLabels from "chartjs-plugin-datalabels";
import BudgetBurndown from "./components/charts/budgetDurndown";
import PlayerTable from "./components/charts/playerTable";
import "hammerjs";
import "chartjs-plugin-zoom";
import { parseFps, parseLog } from "./data/logParse";
import PerformanceOverTime from "./components/charts/performanceOverTime";
import PerformancePlayerBar from "./components/charts/performancePlayerBar";
import LeftDrawer from "./components/leftDrawer/leftDrawer";
import { ThemeProvider, useTheme } from "@material-ui/core/styles";
import Toolbar from "@material-ui/core/Toolbar";
import CssBaseline from "@material-ui/core/CssBaseline";
import { useStyles } from "./styles";
import { HashRouter, Navigate, Route, Routes } from "react-router-dom";
import TopAppBar from "./components/topAppBar";
import NotFoundPage from "./components/notFoundPage";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";
import CampaignScore from "./components/routes/campaignScore";
import { EGAG_EARLY_ACCESS } from "./devLogs/egag_early_access";
import WarAnnouncement from "./components/warAnnouncement/warAnnouncement";
import { responsiveFontSizes } from "@material-ui/core";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import { IntlProvider } from "react-intl";

Chart.plugins.unregister(ChartDataLabels);

const firebaseConfig = {
  apiKey: "AIzaSyBvUv_Li0UnU_ypDnFwQ47EuwJDX_imdBg",
  authDomain: "opt-stats.firebaseapp.com",
  databaseURL: "https://opt-stats.firebaseio.com",
  projectId: "opt-stats",
  storageBucket: "opt-stats.appspot.com",
  messagingSenderId: "412471479558",
  appId: "1:412471479558:web:7404e841f4c882c9df6287",
};
firebase.initializeApp(firebaseConfig);

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
      parseLog(EGAG_EARLY_ACCESS).then(
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
  const theme = responsiveFontSizes(useTheme());
  const classes = useStyles();
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <HashRouter>
      <IntlProvider locale={"de"}>
        <ThemeProvider theme={theme}>
          <div className={classes.root}>
            <CssBaseline />
            <TopAppBar onMenuClick={() => setDrawerOpen(true)} />
            <LeftDrawer
              onOpen={() => setDrawerOpen(true)}
              onClose={() => setDrawerOpen(false)}
              open={drawerOpen}
            />
            <Backdrop className={classes.backdrop} open={loading}>
              <CircularProgress color={"secondary"} />
            </Backdrop>
            <main className={classes.main}>
              <Toolbar />
              <Routes>
                <Route path={"war-announcement"}>
                  <Route path={""} element={<Navigate to="latest" />} />
                  <Route path={"latest"} element={<Navigate to="../0/0" />} />
                  <Route path={":campaignId"}>
                    <Route path={":warEventId"} element={<WarAnnouncement />} />
                  </Route>
                </Route>
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
                      <CampaignScore
                        dominationDatasets={dominationDatasets}
                        scoreDatasets={scoreDatasets}
                      />
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
      </IntlProvider>
    </HashRouter>
  );
}

export default App;
