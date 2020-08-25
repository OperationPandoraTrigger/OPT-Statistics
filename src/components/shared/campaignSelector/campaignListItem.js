import React from "react";
import {
  Checkbox,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@material-ui/core";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import IconButton from "@material-ui/core/IconButton";
import { ExpandLess, ExpandMore } from "@material-ui/icons";
import { useCampaignSelectorStyles } from "./campaignSelector.style";

function CampaignListItem({
  onClick,
  open,
  checked,
  indeterminate,
  onSecondaryAction,
  children,
}) {
  const classes = useCampaignSelectorStyles();

  return (
    <ListItem
      className={classes.campaignListItem}
      role={undefined}
      dense
      button
      onClick={onClick}
    >
      <ListItemIcon>
        <Checkbox
          disableRipple
          checked={checked}
          indeterminate={indeterminate}
        />
      </ListItemIcon>
      <ListItemText>{children}</ListItemText>
      <ListItemSecondaryAction onClick={onSecondaryAction}>
        <IconButton>{open ? <ExpandLess /> : <ExpandMore />}</IconButton>
      </ListItemSecondaryAction>
    </ListItem>
  );
}

export default CampaignListItem;
