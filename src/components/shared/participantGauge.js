import React from "react";
import CountUp from "react-countup";
import { Box, CircularProgress, Tooltip, useTheme } from "@material-ui/core";
import { useStyles } from "../../styles";

function ParticipantGauge({ yes = 0, maybe = 0, no = 0 }) {
  const theme = useTheme();
  const classes = useStyles();
  const predictedMax = yes + maybe + 4;

  return (
    <Tooltip title={`Ja: ${yes} Nein: ${no} Vielleicht: ${maybe}`} arrow>
      <Box position="relative" display="inline-flex">
        <CircularProgress
          size={theme.typography.h1.fontSize}
          thickness={2.6}
          className={classes.progressSecondary}
          variant={"determinate"}
          value={(100 / predictedMax) * (yes + maybe)}
        />
        <CircularProgress
          size={theme.typography.h1.fontSize}
          className={classes.progressPrimary}
          variant={"determinate"}
          value={(100 / predictedMax) * yes}
        />
        <Box
          top={0}
          right={0}
          bottom={0}
          left={0}
          position="absolute"
          display="flex"
          alignItems="center"
          justifyContent="center"
          fontSize={theme.typography.h4.fontSize}
        >
          <CountUp preserveValue end={yes + maybe / 2} />
        </Box>
      </Box>
    </Tooltip>
  );
}

export default ParticipantGauge;
