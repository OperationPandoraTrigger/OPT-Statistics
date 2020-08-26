import React from "react";
import { Hidden, Typography } from "@material-ui/core";
import WarEventEnroll from "../shared/warEventEnroll";

function WarAnnouncement(props) {
  const warEvent = {
    matchId: "1.1",
    matchDate: new Date(),
    matchName: "Schlacht #1",
    campaignName: "Ernte gut, alles gut",
  };
  return (
    <div>
      <Typography variant={"overline"}>
        Saison 2020 - {warEvent.campaignName}
      </Typography>
      <Typography variant={"body1"}>
        <em>Kriegsreportern wird es gestattet das Schlachtfeld zu betreten.</em>
      </Typography>
      <Typography variant={"h3"}>Anmeldungen</Typography>
      <Typography variant={"body1"}>SWORD: 10</Typography>
      <Typography variant={"body1"}>ARF: 10</Typography>
      <WarEventEnroll />
      <Typography variant={"h3"}>Wahl des Sektors</Typography>
      <Typography variant={"body1"}>SWORD greift Sektor ??? an.</Typography>
      <Typography variant={"body1"}>ARF greift Sektor ??? an.</Typography>
      <Typography>
        <a href="https://www.figma.com/file/oml9e6Puvw5OWmOE1qW9r3/Rosche-2020---ALPHA?node-id=176%3A33">
          Vorläufige Sektoren-Karte
        </a>
      </Typography>
      <Hidden smDown>
        <iframe
          width="800"
          height="450"
          src="https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Ffile%2Foml9e6Puvw5OWmOE1qW9r3%2FRosche-2020-ALPHA%3Fnode-id%3D0%253A1&chrome=DOCUMENTATION"
        />
      </Hidden>
      <Typography variant={"h3"}>Wahl der Seite</Typography>
      <Typography variant={"body1"}>ARF spielt AAF</Typography>
      <Typography variant={"body1"}>SWORD spielt CSAT</Typography>

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
            "Unsere aktuellen Server-Versionen"
          </a>
        </li>
        <li>
          <a href="https://docs.google.com/document/d/1x_9wuywOlu04DpzFatMErRSTKwJF4ntTtv_ZfRpV-cY">
            Aktuelles Kampagnendokument
          </a>
        </li>
      </ul>
      <Typography variant={"h3"}>Verbrannte Sektoren</Typography>
      <Typography variant={"body1"}>keine</Typography>
    </div>
  );
}

export default WarAnnouncement;
