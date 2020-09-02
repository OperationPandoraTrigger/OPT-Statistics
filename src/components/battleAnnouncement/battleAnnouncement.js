import React from "react";
import { Divider, Typography } from "@material-ui/core";
import firebase from "firebase/app";
import { useObjectVal } from "react-firebase-hooks/database";
import BattleChronometer from "./battleChronometer";
import { useParams } from "react-router-dom";
import BattleParticipants from "./battleParticipants";
import BattleSectorChoice from "./battleSectorChoice";
import BattleSideChoice from "./battleSideChoice";

function BattleAnnouncement() {
  const { campaignId, battleId } = useParams();
  const [campaignName] = useObjectVal(
    firebase.database().ref(`campaigns/${campaignId}/campaignName`)
  );
  const [battleName] = useObjectVal(
    firebase.database().ref(`battles/${battleId}/battleName`)
  );
  const [battleStart] = useObjectVal(
    firebase.database().ref(`battles/${battleId}/battleStart`)
  );
  const [battleEnd] = useObjectVal(
    firebase.database().ref(`battles/${battleId}/battleEnd`)
  );

  const loading = !(battleName && battleStart && battleEnd);
  if (loading) return <></>;

  return (
    <div>
      <Typography variant={"overline"}>Saison 2020 - {campaignName}</Typography>
      <Typography variant={"h2"}>{battleName}</Typography>
      <Typography variant={"body1"} fontStyle={"italic"}>
        Kriegsreportern wird es gestattet das Schlachtfeld zu betreten.
      </Typography>
      <BattleChronometer
        battleStart={new Date(+battleStart)}
        battleEnd={new Date(+battleEnd)}
      />
      <Divider />
      <BattleParticipants battleId={battleId} />
      <Divider />
      <BattleSectorChoice battleId={battleId} />
      <Divider />
      <BattleSideChoice />
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

export default BattleAnnouncement;
