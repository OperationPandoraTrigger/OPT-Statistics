import "./sectorColors.css";
import React, { useCallback, useEffect, useState } from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import { RadioSVGMap } from "react-svg-map";
import EGAG_SECTORS from "../../svg/egag_sectors.js";
import firebase from "firebase/app";
import { SIDE_TO_COLOR_MAP } from "./faction";
import { Typography } from "@material-ui/core";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import { useObjectVal } from "react-firebase-hooks/database";
import { useStyles } from "../../styles";

const INITIAL_SECTOR_COLOR_MAP = {
  "sector-1": "red",
  "sector-2": "red",
  "sector-3": "red",
  "sector-4": "red",
  "sector-5": "red",
  "sector-6": "red",
  "sector-7": "red",
  "sector-8": "red",
  "sector-9": "red",
  "sector-10": "red",
  "sector-11": "red",
  "sector-12": "green",
  "sector-13": "red",
  "sector-14": "red",
  "sector-15": "red",
  "sector-16": "red",
  "sector-17": "green",
  "sector-18": "green",
  "sector-19": "green",
  "sector-20": "green",
  "sector-21": "green",
  "sector-22": "green",
  "sector-23": "green",
  "sector-24": "green",
  "sector-25": "green",
  "sector-26": "green",
  "sector-27": "green",
  "sector-28": "green",
  "sector-29": "green",
  "sector-30": "green",
};

function SectorChoiceDialog({
  onConfirm,
  battleId,
  myFaction,
  ...dialogProps
}) {
  const classes = useStyles();
  const [sectorColorMap, setSectorColorMap] = useState(
    INITIAL_SECTOR_COLOR_MAP
  );
  const [selectedSector, setSelectedSector] = useState();
  const [battleStart] = useObjectVal(
    firebase.database().ref(`battles/${battleId}/battleStart`)
  );

  // reset to origin value stored by Backend
  const resetSector = useCallback(
    () =>
      firebase
        .database()
        .ref(`pendingSecretSectorChoices/${battleId}/${myFaction}`)
        .once("value")
        .then((snapshot) => {
          setSelectedSector(snapshot.val());
        }),
    []
  );

  useEffect(() => {
    if (battleStart) {
      firebase
        .database()
        .ref(`battles`)
        .orderByChild("battleStart")
        .endAt(battleStart) // do not include own battle
        .once("value")
        .then((snapshot) => {
          const battles = snapshot.val();
          battles.forEach(({ attackingSector, factionSide, battleWinner }) => {
            if (attackingSector) {
              Object.values(attackingSector).forEach((sectorId) => {
                const battleWinnerSide = factionSide[battleWinner];
                const wonSector = attackingSector[battleWinner];
                const sectorSvgId = `sector-${sectorId}`;
                let nextColor;

                if (wonSector && battleWinnerSide) {
                  nextColor = SIDE_TO_COLOR_MAP[battleWinnerSide];
                } else {
                  nextColor = INITIAL_SECTOR_COLOR_MAP[sectorSvgId];
                }

                const nextSectorColorMap = {
                  [sectorSvgId]: `disabled ${nextColor}`,
                };
                setSectorColorMap((prev) => ({
                  ...prev,
                  ...nextSectorColorMap,
                }));
              });
            }
          });
        });
    }

    resetSector();
  }, [resetSector, battleStart]);

  const handleSectorChange = (location) => {
    setSelectedSector(location);
  };

  return (
    <Dialog {...dialogProps}>
      <DialogTitle>Wähle einen Angriffsektor</DialogTitle>
      <RadioSVGMap
        selectedLocationId={selectedSector?.id}
        onChange={handleSectorChange}
        map={EGAG_SECTORS}
        locationClassName={(location) => {
          const burned =
            sectorColorMap[location.id] !==
            INITIAL_SECTOR_COLOR_MAP[location.id]
              ? "burned"
              : "";
          const selected = location.id === selectedSector?.id ? "selected" : "";

          return `sector ${sectorColorMap[location.id]} ${burned} ${selected}`;
        }}
      />
      <DialogActions>
        <Typography className={classes.sectorName} variant={"button"}>
          {selectedSector?.getAttribute?.("name")}
        </Typography>
        <Button
          onClick={() => {
            dialogProps.onClose();
            resetSector();
          }}
          color="inherit"
        >
          Abbrechen
        </Button>
        <Button
          onClick={() => {
            onConfirm(selectedSector).then(() => dialogProps.onClose());
          }}
          color="primary"
          autoFocus
        >
          Speichern
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default SectorChoiceDialog;
