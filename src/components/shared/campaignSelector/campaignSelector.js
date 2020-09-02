import React, { useState } from "react";
import { Typography } from "@material-ui/core";
import BattleListItem from "./battleListItem";
import Collapse from "@material-ui/core/Collapse";
import List from "@material-ui/core/List";
import CampaignListItem from "./campaignListItem";
import { useObjectVal } from "react-firebase-hooks/database";
import firebase from "firebase/app";

function CampaignSelector({ campaignId }) {
  const [campaignName] = useObjectVal(
    firebase.database().ref(`campaigns/${campaignId}/campaignName`)
  );
  const [battles] = useObjectVal(
    firebase.database().ref(`/battles`).orderByChild("battleStart")
  );

  const [selection, setSelection] = useState([]);
  const [open, setOpen] = useState(false);

  const handleChange = (event, value) => {
    setSelection(value);
  };
  const toggleOpen = () => {
    setOpen(!open);
  };
  const handleSelectAll = () => {
    if (selection.length === battles.length) {
      // select none
      setSelection([]);
    } else {
      // select all
      setSelection(battles.map((w) => w.battleId));
    }
  };

  return (
    <>
      <List disablePadding>
        <CampaignListItem
          onSecondaryAction={toggleOpen}
          onClick={handleSelectAll}
          indeterminate={
            selection.length !== 0 && selection.length !== battles.length
          }
          checked={selection.length === battles.length}
          open={open}
        >
          <Typography>{campaignName}</Typography>
        </CampaignListItem>
      </List>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List disablePadding>
          {battles.map((battleEvent) => (
            <BattleListItem
              key={battleEvent.battleStart}
              onChange={handleChange}
              selection={selection}
              battleEvent={battleEvent}
            />
          ))}
        </List>
      </Collapse>
    </>
  );
}

export default CampaignSelector;
