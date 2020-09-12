import React from "react";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "@material-ui/icons";
import { Typography } from "@material-ui/core";
import { useStyles } from "../../styles";
import { useObjectVal } from "react-firebase-hooks/database";
import firebase from "firebase/app";

function BattleNavigator({ currentBattleId, currentCampaignId }) {
  const classes = useStyles();
  const [campaignName] = useObjectVal(
    firebase.database().ref(`campaigns/${currentCampaignId}/campaignName`)
  );
  const nextBattleId = +currentBattleId + 1;
  const prevBattleId = +currentBattleId - 1;
  const [nextBattleName] = useObjectVal(
    firebase.database().ref(`battles/${nextBattleId}/battleName`)
  );
  const [prevBattleName] = useObjectVal(
    firebase.database().ref(`battles/${prevBattleId}/battleName`)
  );

  return (
    <Box className={classes.battleNavigator}>
      <Button
        className={classes.battleNavigatorPrev}
        disabled={!prevBattleName}
        component={Link}
        to={`/battle-announcement/${prevBattleId}`}
      >
        <ChevronLeft /> {prevBattleName}
      </Button>
      <Box className={classes.battleNavigatorCampaign}>
        <Typography display={"inline"} variant={"button"}>
          Kampagne {campaignName}
        </Typography>
      </Box>
      <Button
        className={classes.battleNavigatorNext}
        disabled={!nextBattleName}
        component={Link}
        to={`/battle-announcement/${nextBattleId}`}
      >
        {nextBattleName} <ChevronRight />
      </Button>
    </Box>
  );
}

export default BattleNavigator;
