import React, { useState } from "react";
import { Typography } from "@material-ui/core";
import WarEventListItem from "./warEventListItem";
import Collapse from "@material-ui/core/Collapse";
import List from "@material-ui/core/List";
import CampaignListItem from "./campaignListItem";

function CampaignSelector({ warEvents, campaignEvent }) {
  const [selection, setSelection] = useState([]);
  const [open, setOpen] = useState(false);

  const handleChange = (event, value) => {
    setSelection(value);
  };
  const toggleOpen = () => {
    setOpen(!open);
  };
  const handleSelectAll = () => {
    if (selection.length === warEvents.length) {
      // select none
      setSelection([]);
    } else {
      // select all
      setSelection(warEvents.map((w) => w.matchId));
    }
  };

  return (
    <>
      <List disablePadding key={campaignEvent.campaignId}>
        <CampaignListItem
          onSecondaryAction={toggleOpen}
          onClick={handleSelectAll}
          indeterminate={
            selection.length !== 0 && selection.length !== warEvents.length
          }
          checked={selection.length === warEvents.length}
          open={open}
        >
          <Typography>{campaignEvent.campaignName}</Typography>
        </CampaignListItem>
      </List>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List disablePadding>
          {warEvents.map((warEvent) => (
            <WarEventListItem
              key={warEvent.matchId}
              onChange={handleChange}
              selection={selection}
              warEvent={warEvent}
            />
          ))}
        </List>
      </Collapse>
    </>
  );
}

export default CampaignSelector;
