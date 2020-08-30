import {
  Collapse,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@material-ui/core";
import { ExpandLess, ExpandMore } from "@material-ui/icons";
import React from "react";

function CollapseListWrapper({ listOpen, onCollapseChange, label, children }) {
  const open = listOpen.includes(label);
  return (
    <>
      <ListItem button disableRipple onClick={() => onCollapseChange(label)}>
        <ListItemText>
          <Typography variant={"overline"}>{label}</Typography>
        </ListItemText>
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItem>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {children}
        </List>
      </Collapse>
    </>
  );
}

export default CollapseListWrapper;
