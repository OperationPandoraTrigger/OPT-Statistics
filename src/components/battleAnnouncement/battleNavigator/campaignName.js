import React from "react";
import { Typography } from "@material-ui/core";

function CampaignName({ currentCampaignName }) {
  return (
    <Typography variant={"button"}>Kampagne - {currentCampaignName}</Typography>
  );
}

export default CampaignName;
