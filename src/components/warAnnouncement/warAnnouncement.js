import React from "react";
import { Divider, Typography } from "@material-ui/core";
import firebase from "firebase/app";
import { useObjectVal } from "react-firebase-hooks/database";
import WarChronometer from "./warChronometer";
import { useParams } from "react-router-dom";
import WarEventEnrollment from "./warEventEnroll/warEventEnrollment";
import WarEventSectors from "./warEventSectors";
import WarEventSide from "./warEventSide";

function WarAnnouncement() {
  const { campaignId, warEventId } = useParams();
  const [campaignName] = useObjectVal(
    firebase.database().ref(`campaigns/${campaignId}/campaignName`)
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
      <WarEventEnrollment warEventId={warEventId} />
      <Divider />
      <WarEventSectors warEventId={warEventId} />
      <Divider />
      <WarEventSide />
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
