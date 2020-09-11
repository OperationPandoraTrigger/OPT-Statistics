import React from "react";
import { Divider, Typography } from "@material-ui/core";
import firebase from "firebase/app";
import { useObjectVal } from "react-firebase-hooks/database";
import BattleChronometer from "./battleChronometer";
import { Link, useParams } from "react-router-dom";
import BattleParticipants from "./battleParticipants/battleParticipants";
import BattleSectorChoice from "./battleSectorChoice";
import BattleSideChoice from "./battleSideChoice";
import BurnedSectors from "./burnedSectors";
import Box from "@material-ui/core/Box";
import { useStyles } from "../../styles";
import { ChevronLeft, ChevronRight } from "@material-ui/icons";
import Button from "@material-ui/core/Button";

function BattleAnnouncement() {
  const classes = useStyles();
  const { battleId } = useParams();

  const [battle] = useObjectVal(firebase.database().ref(`battles/${battleId}`));
  const { campaignId, battleName, battleStart, battleEnd, battleComment } =
    battle ?? {};

  const [campaignName] = useObjectVal(
    firebase.database().ref(`campaigns/${campaignId}/campaignName`)
  );
  const nextBattleId = +battleId + 1;
  const prevBattleId = +battleId - 1;
  const [nextBattleName] = useObjectVal(
    firebase.database().ref(`battles/${nextBattleId}/battleName`)
  );
  const [prevBattleName] = useObjectVal(
    firebase.database().ref(`battles/${prevBattleId}/battleName`)
  );

  return (
    <div>
      <Box className={classes.battleNavigator}>
        <Button
          disabled={!prevBattleName}
          component={Link}
          to={`/battle-announcement/${prevBattleId}`}
        >
          <ChevronLeft /> {prevBattleName}
        </Button>
        <Typography variant={"button"}>Saison - {campaignName}</Typography>
        <Button
          disabled={!nextBattleName}
          component={Link}
          to={`/battle-announcement/${nextBattleId}`}
        >
          {nextBattleName} <ChevronRight />
        </Button>
      </Box>
      <Typography variant={"h2"}>{battleName}</Typography>
      <Typography className={classes.battleComment} variant={"body1"}>
        {battleComment}
      </Typography>
      <BattleChronometer battleStart={battleStart} battleEnd={battleEnd} />
      <Divider />
      <BattleParticipants battleId={battleId} />
      <Divider />
      <BattleSectorChoice battleId={battleId} />
      <BurnedSectors until={battleStart} />
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
