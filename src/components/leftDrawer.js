import React from "react";
import {
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
} from "@material-ui/core";
import {
  ChatBubble,
  EmojiEvents,
  EuroSymbol,
  Flag,
  Group,
  LocationOn,
  NewReleases,
  Speed,
} from "@material-ui/icons";
import { useStyles } from "../styles";
import ListSubheader from "@material-ui/core/ListSubheader";
import { NavLink } from "react-router-dom";

function LeftDrawer() {
  const classes = useStyles();

  return (
    <Drawer
      className={classes.drawer}
      anchor={"left"}
      variant="permanent"
      classes={{ paper: classes.drawerPaper }}
    >
      <Toolbar />
      <List component={"nav"}>
        <ListSubheader>
          <Typography>Allgemein</Typography>
        </ListSubheader>
        <ListItem
          component={NavLink}
          button
          to={"/OPT-Statistics/war-announcement"}
          activeClassName={"Mui-selected"}
        >
          <ListItemIcon>
            <NewReleases />
          </ListItemIcon>
          <ListItemText>
            <Typography>Schlachtankündigung</Typography>
          </ListItemText>
        </ListItem>

        <ListSubheader>
          <Typography>Statistiken</Typography>
        </ListSubheader>
        <ListItem
          component={NavLink}
          button
          to={"/OPT-Statistics/statistic/performance"}
          activeClassName={"Mui-selected"}
        >
          <ListItemIcon>
            <Speed />
          </ListItemIcon>
          <ListItemText>
            <Typography>Performance</Typography>
          </ListItemText>
        </ListItem>
        <ListItem
          component={NavLink}
          button
          to={"/OPT-Statistics/statistic/economy"}
          activeClassName={"Mui-selected"}
        >
          <ListItemIcon>
            <EuroSymbol />
          </ListItemIcon>
          <ListItemText>
            <Typography>Ressourcen</Typography>
          </ListItemText>
        </ListItem>
        <ListItem
          component={NavLink}
          button
          to={"/OPT-Statistics/statistic/campaign-score"}
          activeClassName={"Mui-selected"}
        >
          <ListItemIcon>
            <Flag />
          </ListItemIcon>
          <ListItemText>
            <Typography>Punkte</Typography>
          </ListItemText>
        </ListItem>
        <ListItem
          component={NavLink}
          button
          to={"/OPT-Statistics/statistic/player-table"}
          activeClassName={"Mui-selected"}
        >
          <ListItemIcon>
            <Group />
          </ListItemIcon>
          <ListItemText>
            <Typography>Spielerstatistiken</Typography>
          </ListItemText>
        </ListItem>

        <ListSubheader>
          <Typography>Externe Links</Typography>
        </ListSubheader>
        <ListItem
          component={"a"}
          button
          target={"_blank"}
          href={"https://aar.byte.pm/missions"}
          activeClassName={"Mui-selected"}
        >
          <ListItemIcon>
            <LocationOn />
          </ListItemIcon>
          <ListItemText>
            <Typography>AAR</Typography>
          </ListItemText>
        </ListItem>
        <ListItem
          component={"a"}
          button
          target={"_blank"}
          href={"https://opt4.net/dashboard/"}
          activeClassName={"Mui-selected"}
        >
          <ListItemIcon>
            <ChatBubble />
          </ListItemIcon>
          <ListItemText>
            <Typography>Forum</Typography>
          </ListItemText>
        </ListItem>
        <ListItem
          component={"a"}
          button
          target={"_blank"}
          href={"https://signatur.opt4.net/public/decorations"}
          activeClassName={"Mui-selected"}
        >
          <ListItemIcon>
            <EmojiEvents />
          </ListItemIcon>
          <ListItemText>
            <Typography>Auszeichnungen</Typography>
          </ListItemText>
        </ListItem>
      </List>
      <Divider />
    </Drawer>
  );
}

export default LeftDrawer;
