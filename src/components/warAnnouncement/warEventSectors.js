import React from "react";
import { Box, Hidden, Typography } from "@material-ui/core";
import Faction from "../shared/faction";
import { useStyles } from "../../styles";
import { useObjectVal } from "react-firebase-hooks/database";
import firebase from "firebase/app";

function WarEventSectors({ warEventId }) {
  const classes = useStyles();
  const [attackingSector] = useObjectVal(
    firebase.database().ref(`warEvents/${warEventId}/attackingSector`)
  );

  return (
    <>
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
    </>
  );
}

export default WarEventSectors;
