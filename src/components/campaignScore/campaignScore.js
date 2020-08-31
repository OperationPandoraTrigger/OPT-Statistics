import React from "react";
import ScoreLineChart from "../charts/scoreLineChart";
import DominationTime from "../charts/dominationTime";

function CampaignScore({ scoreDatasets, dominationDatasets }) {
  return (
    <div>
      <ScoreLineChart datasets={scoreDatasets} />
      <DominationTime datasets={dominationDatasets} />
    </div>
  );
}

export default CampaignScore;
