import React, { useEffect, useState } from "react";
import { Box, Typography } from "@material-ui/core";
import WarEventEnroll from "./warEventEnroll";
import { useObjectVal } from "react-firebase-hooks/database";
import firebase from "firebase/app";
import { delay } from "../../shared/helpers/delay";
import { useLocalStorage } from "../../shared/helpers/useLocalStorage";
import { countBy, groupBy } from "lodash";
import Faction from "../../shared/faction";
import ParticipantGauge from "../participantGauge";

function WarEventEnrollment({ warEventId }) {
  const [counterGauges, setCounterGauges] = useState();
  const [steamProfile] = useLocalStorage("steamProfile");
  const [participants] = useObjectVal(
    firebase.database().ref(`participants/${warEventId}`)
  );

  useEffect(() => {
    if (participants) {
      const participantsByFaction = groupBy(participants, "faction");
      const nextCounterGauges = [];
      for (const factionKey in participantsByFaction) {
        if (participantsByFaction.hasOwnProperty(factionKey)) {
          //state is: yes, no, maybe
          const stateCounts = countBy(
            participantsByFaction[factionKey],
            "state"
          );
          nextCounterGauges.push(
            <Box
              key={factionKey}
              display={"inline-block"}
              m={3}
              textAlign={"center"}
            >
              <Typography variant={"h6"}>
                <Faction factionKey={factionKey} />
              </Typography>
              <ParticipantGauge {...stateCounts} />
            </Box>
          );
        }
      }
      setCounterGauges(nextCounterGauges);
    }
  }, [participants]);

  const [enrollState] = useObjectVal(
    firebase
      .database()
      .ref(`participants/${warEventId}/${steamProfile.steamid}/state`)
  );

  const handleEnrollState = (state) => {
    if (warEventId && steamProfile.steamid) {
      return firebase
        .database()
        .ref(`participants/${warEventId}/${steamProfile.steamid}`)
        .transaction((oldState) => {
          return { ...oldState, state };
        })
        .then(() => delay(500));
    }
    return Promise.reject("missing auth");
  };

  return (
    <>
      <Typography variant={"h3"}>Anmeldungen</Typography>
      <Box display={"flex"}>
        <Box flexGrow={1}>{counterGauges}</Box>
        <Box flexShrink={1}>
          <Typography display={"block"} variant={"button"}>
            Deine Teilnahme
          </Typography>
          <WarEventEnroll
            enrollState={enrollState}
            onEnrollStateChange={handleEnrollState}
          />
        </Box>
      </Box>
    </>
  );
}

export default WarEventEnrollment;
