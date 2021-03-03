import React from "react";
import { Divider, Typography } from "@material-ui/core";
import firebase from "firebase/app";
import { useObjectVal } from "react-firebase-hooks/database";
import BattleChronometer from "./battleChronometer";
import { useParams } from "react-router-dom";
import BattleParticipants from "./battleParticipants/battleParticipants";
import BattleSectorChoice from "./battleSectorChoice";
import BattleSideChoice from "./battleSideChoice";
import BurnedSectors from "./burnedSectors";
import { useStyles } from "../../styles";
import BattleNavigator from "./battleNavigator";
import { now } from "moment";

function BattleAnnouncement() {
  const classes = useStyles();
  const { battleId } = useParams();

  const [battle] = useObjectVal(firebase.database().ref(`battles/${battleId}`));
  const {
    campaignId,
    battleName,
    battleStart = now(),
    battleEnd,
    battleComment,
    deadline,
    attackingSector,
  } = battle ?? {};

  return (
    <div>
      <BattleNavigator
        currentBattleStart={battleStart}
        currentCampaignId={campaignId}
      />
      <Typography variant={"h2"}>{battleName}</Typography>
      <Typography className={classes.battleComment} variant={"body1"}>
        {battleComment}
      </Typography>
      <BattleChronometer battleStart={battleStart} battleEnd={battleEnd} />
      <Divider />
      <BattleParticipants battleId={battleId} />
      <Divider />
      <BattleSectorChoice
        attackingSector={attackingSector}
        deadline={deadline}
        battleId={battleId}
      />
      <BurnedSectors until={battleStart} />
      <Divider />
      <BattleSideChoice />
      <Divider />
      <Typography variant={"h3"}>Technik</Typography>
      <ul>
        <li>
          <a href="https://opt4.net/forum/index.php?thread/4851-fairplay-leitfaden/">
            Fairplay Leitfaden
          </a>
        </li>
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
          <a href="https://docs.google.com/document/d/1CxqtbaIv9ZjSiWZbnSsAOiK3QQ9yl2W4xie6wabF0aI">
            Aktuelles Kampagnendokument
          </a>
        </li>
      </ul>
    </div>
  );
}

export default BattleAnnouncement;
