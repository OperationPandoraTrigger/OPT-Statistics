import React, { useEffect, useState } from "react";
import { parseFps, parseLog } from "../../data/logParse";
import { EGAG_FUN } from "../../devLogs/egag_fun";
import { EGAG_FUN_FPS } from "../../devLogs/egag_fun_fps";
import { Route, Routes } from "react-router-dom";
import PlayerTable from "../charts/playerTable";
import PerformancePlayerBar from "../charts/performancePlayerBar";
import PerformanceOverTime from "../charts/performanceOverTime";
import BudgetBurndown from "../charts/budgetDurndown";
import CampaignScore from "../campaignScore/campaignScore";
import { utc } from "moment";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";
import { useStyles } from "../../styles";

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

function StatisticsProvider(props) {
  const classes = useStyles();
  const [loading, setLoading] = useState(true);
  const [scoreDatasets, setScoreDatasets] = useState([]);
  const [dominationDatasets, setDominationDatasets] = useState([]);
  const [budgetDatasets, setBudgetDatasets] = useState([]);
  const [performanceBarDatasets, setPerformanceBarDatasets] = useState([]);
  const [performanceDatasets, setPerformanceDatasets] = useState([]);
  const [playerStats, setPlayerStats] = useState({});

  useEffect(() => {
    Promise.all([
      parseLog(EGAG_FUN).then(
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
      parseFps(EGAG_FUN_FPS).then(
        ({ performanceDatasets, performanceBarDatasets }) => {
          setPerformanceDatasets(performanceDatasets);
          setPerformanceBarDatasets(performanceBarDatasets);
        }
      ),
    ]).then(() => setLoading(false));
  }, []);

  return (
    <div>
      <Backdrop className={classes.backdrop} open={loading}>
        <CircularProgress color={"secondary"} />
      </Backdrop>
      <Routes>
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
      </Routes>
    </div>
  );
}

export default StatisticsProvider;
