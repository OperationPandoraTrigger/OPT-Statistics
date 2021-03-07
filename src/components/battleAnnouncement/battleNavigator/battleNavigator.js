import React from "react";
import { Grid } from "@material-ui/core";
import PrevBattleLink from "./prevBattleLink";
import NextBattleLink from "./nextBattleLink";
import CampaignName from "./campaignName";

function BattleNavigator({ currentBattleStart, currentCampaignName }) {
  return (
    <Grid container alignItems={"center"}>
      <Grid item xs={4} textAlign={"left"}>
        <PrevBattleLink currentBattleStart={currentBattleStart} />
      </Grid>
      <Grid item xs={4} textAlign={"center"}>
        <CampaignName currentCampaignName={currentCampaignName} />
      </Grid>
      <Grid item xs={4} textAlign={"right"}>
        <NextBattleLink currentBattleStart={currentBattleStart} />
      </Grid>
    </Grid>
  );
}

export default BattleNavigator;
