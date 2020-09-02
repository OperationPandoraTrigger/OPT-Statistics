import React from "react";
import { Box, Typography } from "@material-ui/core";
import Faction from "../shared/faction";
import { useStyles } from "../../styles";

function BattleSideChoice() {
  const classes = useStyles();

  return (
    <>
      <Typography variant={"h3"}>Wahl der Seite</Typography>
      <Box className={classes.captionInlineBox}>
        <Typography variant={"caption"}>
          <Faction factionKey={"arf"} />
        </Typography>
        <Typography variant={"body1"}>spielt AAF</Typography>
      </Box>
      <Box className={classes.captionInlineBox}>
        <Typography variant={"caption"}>
          <Faction factionKey={"sword"} />
        </Typography>
        <Typography variant={"body1"}>spielt CSAT</Typography>
      </Box>
    </>
  );
}

export default BattleSideChoice;
