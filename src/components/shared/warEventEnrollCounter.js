import React from "react";
import CountUp from "react-countup";
import { CircularProgress } from "@material-ui/core";
import Box from "@material-ui/core/Box";
import firebase from "firebase/app";
import { useObjectVal } from "react-firebase-hooks/database";
import { countBy } from "lodash";
import { useStyles } from "../../styles";
import Tooltip from "@material-ui/core/Tooltip";

function WarEventEnrollCounter({ warEventId }) {
  const classes = useStyles();
  const databaseRef = firebase
    .database()
    .ref(`warEvents/${warEventId}/participants`);
  const [warEventParticipants = {}] = useObjectVal(databaseRef);
  const { yes = 0, maybe = 0, no = 0 } = countBy(warEventParticipants, "state");
  const predictedMax = yes + maybe + 3;

  return (
    <>
      <Tooltip title={`Ja: ${yes} Nein: ${no} Vielleicht: ${maybe}`} arrow>
        <Box position="relative" display="inline-flex">
          <CircularProgress
            thickness={2.6}
            className={classes.progressSecondary}
            variant={"determinate"}
            value={(100 / predictedMax) * (yes + maybe)}
          />
          <CircularProgress
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
          >
            <CountUp preserveValue end={yes + maybe / 2} />
          </Box>
        </Box>
      </Tooltip>
    </>
  );
}

export default WarEventEnrollCounter;
