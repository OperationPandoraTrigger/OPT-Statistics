import React, { useState } from "react";
import { Box, Typography } from "@material-ui/core";
import SectorChoiceDialog from "../shared/sectorChoiceDialog";
import Faction from "../shared/faction";
import { useStyles } from "../../styles";
import firebase from "firebase/app";
import Button from "@material-ui/core/Button";
import { now } from "moment";
import "moment/locale/de";
import { FormattedPlural, FormattedRelativeTime } from "react-intl";
import { trimStart } from "lodash";

function BattleSectorChoice({ attackingSector, deadline, battleId }) {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const delta = deadline - now();
  const myFaction = "arf"; // TODO get from Auth/userRole

  const handleSectorChoice = (svgPath) => {
    const sectorId = trimStart(svgPath.id, "sector-");

    return firebase
      .database()
      .ref(`pendingSecretSectorChoices/${battleId}/${myFaction}`)
      .set(sectorId);
  };

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
      <Box className={classes.captionBlockBox}>
        <Typography m={1} variant={"body1"}>
          <FormattedPlural
            value={delta > 0}
            id={"publish_prefix"}
            zero={"Wurde veröffentlicht"} // heck why don't u work?
            one={"Wird veröffentlicht"}
            other={"Wurde veröffentlicht"} // takes place for zero value
          />{" "}
          <FormattedRelativeTime
            value={delta}
            updateIntervalInSeconds={1}
            numeric={"auto"}
          />
        </Typography>
      </Box>
      <Box>
        <Button disabled={delta <= 0} onClick={() => setOpen(true)}>
          Angriffssektor Wählen
        </Button>
        <SectorChoiceDialog
          open={open}
          onClose={() => setOpen(false)}
          myFaction={myFaction}
          battleId={battleId}
          onConfirm={handleSectorChoice}
        />
      </Box>
      <Typography>
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://www.figma.com/file/oml9e6Puvw5OWmOE1qW9r3/Rosche-2020---ALPHA?node-id=176%3A33"
        >
          Vorläufige Sektoren-Karte
        </a>
      </Typography>
    </>
  );
}

export default BattleSectorChoice;
