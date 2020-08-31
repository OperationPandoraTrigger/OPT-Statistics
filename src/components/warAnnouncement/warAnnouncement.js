import React, { useEffect, useState } from "react";
import { Box, Divider, Hidden, Typography } from "@material-ui/core";
import WarEventEnroll from "../shared/warEventEnroll";
import WarEventEnrollGauge from "../shared/warEventEnrollGauge";
import firebase from "firebase/app";
import { useObjectVal } from "react-firebase-hooks/database";
import { delay } from "../shared/helpers/delay";
import { useAuthState } from "react-firebase-hooks/auth";
import { countBy, groupBy } from "lodash";
import WarChronometer from "./warChronometer";
import { useStyles } from "../../styles";
import Faction from "../shared/faction";
import { useParams } from "react-router-dom";

function WarAnnouncement() {
  const classes = useStyles();
  const { campaignId, warEventId } = useParams();
  const [enrollState, setEnrollState] = useState();
  const [counterGauges, setCounterGauges] = useState();
  const [user] = useAuthState(firebase.auth());
  const [campaignName] = useObjectVal(
    firebase.database().ref(`campaigns/${campaignId}/campaignName`)
  );
  const [participants] = useObjectVal(
    firebase.database().ref(`warEvents/${warEventId}/participants`)
  );
  const [matchName] = useObjectVal(
    firebase.database().ref(`warEvents/${warEventId}/matchName`)
  );
  const [matchStart] = useObjectVal(
    firebase.database().ref(`warEvents/${warEventId}/matchStart`)
  );
  const [matchEnd] = useObjectVal(
    firebase.database().ref(`warEvents/${warEventId}/matchEnd`)
  );
  const [attackingSector] = useObjectVal(
    firebase.database().ref(`warEvents/${warEventId}/attackingSector`)
  );

  const handleEnrollState = (state) => {
    if (user) {
      return firebase
        .database()
        .ref(`warEvents/${warEventId}/participants/${user.uid}/state`)
        .transaction(() => {
          return state;
        })
        .then(() => delay(500));
    }
    return Promise.reject("no user");
  };

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
              <WarEventEnrollGauge {...stateCounts} />
            </Box>
          );
        }
      }
      setCounterGauges(nextCounterGauges);
    }
  }, [participants]);

  useEffect(() => {
    if (participants && user?.uid) {
      setEnrollState(participants[user.uid]?.state);
    }
  }, [participants, user]);

  const loading = !(matchName && matchStart && matchEnd);
  if (loading) return <></>;

  return (
    <div>
      <Typography variant={"overline"}>Saison 2020 - {campaignName}</Typography>
      <Typography variant={"h2"}>{matchName}</Typography>
      <Typography variant={"body1"} fontStyle={"italic"}>
        Kriegsreportern wird es gestattet das Schlachtfeld zu betreten.
      </Typography>
      <WarChronometer
        matchStart={new Date(+matchStart)}
        matchEnd={new Date(+matchEnd)}
      />

      <Divider />
      <Typography variant={"h3"}>Anmeldungen</Typography>
      <Box display={"flex"}>
        <Box flexGrow={1}>{counterGauges}</Box>
        {user?.uid && (
          <Box flexShrink={1}>
            <Typography display={"block"} variant={"button"}>
              Deine Teilnahme
            </Typography>
            <WarEventEnroll
              enrollState={enrollState}
              onEnrollStateChange={handleEnrollState}
            />
          </Box>
        )}
      </Box>
      <Divider />
      <Typography variant={"h3"}>Wahl des Sektors</Typography>
      <Box className={classes.captionInlineBox}>
        <Typography variant={"caption"}>
          <Faction factionKey={"arf"} />
        </Typography>
        <Typography variant={"body1"}>
          Sektor {attackingSector?.arf ?? "unbekannt"}
        </Typography>
      </Box>
      <Box className={classes.captionInlineBox}>
        <Typography variant={"caption"}>
          <Faction factionKey={"sword"} />
        </Typography>
        <Typography variant={"body1"}>
          Sektor {attackingSector?.sword ?? "unbekannt"}
        </Typography>
      </Box>
      <Typography>
        <a href="https://www.figma.com/file/oml9e6Puvw5OWmOE1qW9r3/Rosche-2020---ALPHA?node-id=176%3A33">
          Vorläufige Sektoren-Karte
        </a>
      </Typography>
      <Hidden smDown>
        <iframe
          title="sector-map"
          width="800"
          height="450"
          src="https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Ffile%2Foml9e6Puvw5OWmOE1qW9r3%2FRosche-2020-ALPHA%3Fnode-id%3D0%253A1&chrome=DOCUMENTATION"
        />
      </Hidden>
      <Typography variant={"h4"}>Verbrannte Sektoren</Typography>
      <Typography variant={"body2"}>keine</Typography>
      <Divider />
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
      <Divider />
      <Typography variant={"h3"}>Technik</Typography>
      <ul>
        <li>
          <a href="https://opt4.net/forum/index.php?thread/8-opt4-server-ips/">
            OPT4-Teamspeak
          </a>
          ts3.opt4.net
        </li>
        <li>
          <a href="https://opt4.net/forum/index.php?thread/8-opt4-server-ips/">
            OPT4-Server-IPs
          </a>
        </li>
        <li>
          <a href="https://opt4.net/forum/index.php?thread/1214-unsere-aktuellen-server-versionen/">
            Unsere aktuellen Server-Versionen
          </a>
        </li>
        <li>
          <a href="https://docs.google.com/document/d/1x_9wuywOlu04DpzFatMErRSTKwJF4ntTtv_ZfRpV-cY">
            Aktuelles Kampagnendokument
          </a>
        </li>
      </ul>
    </div>
  );
}

export default WarAnnouncement;
