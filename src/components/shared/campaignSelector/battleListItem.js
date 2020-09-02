import React from "react";
import {
  Checkbox,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@material-ui/core";
import { xor } from "lodash";
import { useCampaignScoreStyles } from "../../campaignScore/campaignScore.style";

function BattleListItem({ battleEvent, selection, onChange }) {
  const { battleName, battleId } = battleEvent;
  const classes = useCampaignScoreStyles();

  return (
    <ListItem
      role={undefined}
      dense
      button
      onClick={(event) => onChange(event, xor(selection, [battleId]))}
      className={classes.nested}
    >
      <ListItemIcon>
        <Checkbox disableRipple checked={selection.includes(battleId)} />
      </ListItemIcon>
      <ListItemText>
        <Typography>{battleName}</Typography>
      </ListItemText>
    </ListItem>
  );
}

export default BattleListItem;
