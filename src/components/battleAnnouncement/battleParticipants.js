import React, { useEffect, useState } from "react";
import { Box, Typography } from "@material-ui/core";
import BattleEnrollButtonGroup from "./battleEnrollButtonGroup";
import { useObjectVal } from "react-firebase-hooks/database";
import firebase from "firebase/app";
import { delay } from "../shared/helpers/delay";
import { useLocalStorage } from "../shared/helpers/useLocalStorage";
import { countBy, groupBy } from "lodash";
import Faction from "../shared/faction";
import ParticipantGauge from "./participantGauge";
import { ExpandLess, ExpandMore } from "@material-ui/icons";
import PlayerChip from "../shared/playerChip";
import Collapse from "@material-ui/core/Collapse";
import ButtonBase from "@material-ui/core/ButtonBase";

function BattleParticipants({ battleId }) {
  const [counterGauges, setCounterGauges] = useState([]);
  const [expandParticipantNames, setExpandParticipantNames] = useState(false);
  const [steamProfile] = useLocalStorage("steamProfile", {
    avatar: undefined,
    personaname: undefined,
    profileurl: undefined,
    steamid: undefined,
  });
  const [participants] = useObjectVal(
    firebase.database().ref(`participants/${battleId}`)
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
          nextCounterGauges.push({ factionKey, stateCounts });
        }
      }
      setCounterGauges(nextCounterGauges);
    }
  }, [participants]);

  const [enrollState] = useObjectVal(
    firebase
      .database()
      .ref(`participants/${battleId}/${steamProfile.steamid}/state`)
  );

  const handleEnrollState = (state) => {
    if (battleId && steamProfile.steamid) {
      return firebase
        .database()
        .ref(`participants/${battleId}/${steamProfile.steamid}`)
        .transaction((oldState) => {
          if (oldState === null) {
            // create new
            return {
              steamName: steamProfile.personaname,
              steamId: steamProfile.steamid,
              steamAvatar: steamProfile.avatar,
              steamProfileUrl: steamProfile.profileurl,
              faction: "opt",
              state,
            };
          }
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
        <Box flexGrow={1}>
          {counterGauges.map(({ factionKey, stateCounts }) => (
            <Box
              key={factionKey}
              display={"inline-block"}
              m={3}
              textAlign={"center"}
            >
              <ButtonBase
                disableRipple
                onClick={() =>
                  setExpandParticipantNames(expandParticipantNames)
                }
              >
                <Typography variant={"h6"}>
                  <Faction factionKey={factionKey} />
                </Typography>
                {expandParticipantNames ? <ExpandLess /> : <ExpandMore />}
                <ParticipantGauge {...stateCounts} />
              </ButtonBase>
              <Collapse
                in={expandParticipantNames}
                timeout="auto"
                unmountOnExit
              >
                {Object.keys(participants).map((steamId) => (
                  <PlayerChip
                    key={"s"}
                    label={"Fr"}
                    avatarSrc={
                      "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/ad/ad31fda82eda3600385bc00cc4551614b3e02bf9.jpg"
                    }
                  />
                ))}
              </Collapse>
            </Box>
          ))}
        </Box>
        <Box flexShrink={1}>
          <Typography display={"block"} variant={"button"}>
            Deine Teilnahme
          </Typography>
          <BattleEnrollButtonGroup
            enrollState={enrollState}
            onEnrollStateChange={handleEnrollState}
          />
        </Box>
      </Box>
    </>
  );
}

export default BattleParticipants;
