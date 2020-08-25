import React from "react";
import {
  Checkbox,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@material-ui/core";
import { xor } from "lodash";
import { useCampaignScoreStyles } from "../../routes/campaignScore.style";

function WarEventListItem({ warEvent, selection, onChange }) {
  const { matchName, matchId } = warEvent;
  const classes = useCampaignScoreStyles();

  return (
    <ListItem
      role={undefined}
      dense
      button
      onClick={(event) => onChange(event, xor(selection, [matchId]))}
      className={classes.nested}
    >
      <ListItemIcon>
        <Checkbox disableRipple checked={selection.includes(matchId)} />
      </ListItemIcon>
      <ListItemText>
        <Typography>{matchName}</Typography>
      </ListItemText>
    </ListItem>
  );
}

export default WarEventListItem;
