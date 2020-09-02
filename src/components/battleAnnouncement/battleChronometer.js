import React from "react";
import { Box, Typography } from "@material-ui/core";
import { FormattedDate, FormattedTime } from "react-intl";
import { useStyles } from "../../styles";

function BattleChronometer({ battleStart, battleEnd }) {
  const classes = useStyles();

  return (
    <>
      <Box className={classes.captionBlockBox}>
        <Typography variant={"caption"}>Schlachttag</Typography>
        <Typography variant={"body1"}>
          <FormattedDate dateStyle={"long"} value={battleStart} />
        </Typography>
      </Box>
      <Box className={classes.captionInlineBox}>
        <Typography variant={"caption"}>Briefing</Typography>
        <Typography variant={"body1"}>
          <FormattedTime value={battleStart} />
          &nbsp;Uhr
        </Typography>
      </Box>
      <Box className={classes.captionInlineBox}>
        <Typography variant={"caption"}>Spielzeit</Typography>
        <Typography variant={"body1"}>90 Minuten</Typography>
      </Box>
      <Box className={classes.captionInlineBox}>
        <Typography variant={"caption"}>Debriefing</Typography>
        <Typography variant={"body1"}>
          <FormattedTime value={battleEnd} />
          &nbsp;Uhr
        </Typography>
      </Box>
    </>
  );
}

export default BattleChronometer;
