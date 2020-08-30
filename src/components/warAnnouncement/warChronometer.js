import React from "react";
import { Box, Typography } from "@material-ui/core";
import { FormattedDate, FormattedTime } from "react-intl";
import { useStyles } from "../../styles";

function WarChronometer({ matchStart, matchEnd }) {
  const classes = useStyles();

  return (
    <>
      <Box className={classes.warChronometerHeading}>
        <Typography variant={"caption"}>Schlachttag</Typography>
        <Typography variant={"body1"}>
          <FormattedDate dateStyle={"long"} value={matchStart} />
        </Typography>
      </Box>
      <Box className={classes.warChronometerBox}>
        <Typography variant={"caption"}>Briefing</Typography>
        <Typography variant={"body1"}>
          <FormattedTime value={matchStart} />
          &nbsp;Uhr
        </Typography>
      </Box>
      <Box className={classes.warChronometerBox}>
        <Typography variant={"caption"}>Spielzeit</Typography>
        <Typography variant={"body1"}>90 Minuten</Typography>
      </Box>
      <Box className={classes.warChronometerBox}>
        <Typography variant={"caption"}>Debriefing</Typography>
        <Typography variant={"body1"}>
          <FormattedTime value={matchEnd} />
          &nbsp;Uhr
        </Typography>
      </Box>
    </>
  );
}

export default WarChronometer;
