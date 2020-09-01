import React, { useEffect, useState } from "react";
import {
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  SwipeableDrawer,
  Toolbar,
  Typography,
} from "@material-ui/core";
import {
  Beenhere,
  ChatBubble,
  ChevronRight,
  EmojiEvents,
  EuroSymbol,
  Flag,
  Group,
  LocationOn,
  Login,
  NewReleases,
  PowerSettingsNew,
  Speed,
} from "@material-ui/icons";
import { useStyles } from "../../styles";
import { NavLink } from "react-router-dom";
import CampaignSelectorPopover from "../shared/campaignSelector/campaignSelectorPopover";
import { OptFullLogo } from "../../svg";
import { login, logout } from "../shared/authenticator";
import { useAuthState } from "react-firebase-hooks/auth";
import firebase from "firebase/app";
import { xor } from "lodash";
import CollapseListWrapper from "./collapseListWrapper";
import { useLocation } from "react-router-dom";

function LeftDrawer({ open, onClose, onOpen }) {
  const classes = useStyles();
  const [listOpen, setListOpen] = useState(["Allgemein"]);
  const [user, loadingUser] = useAuthState(firebase.auth());
  const [campaignSelectorAnchorEl, setCampaignSelectorAnchorEl] = useState(
    null
  );
  let location = useLocation();

  React.useEffect(() => {
    onClose(); // close on navigation
  }, [location]);

  return (
    <SwipeableDrawer
      className={classes.drawer}
      anchor={"left"}
      open={open}
      onClose={onClose}
      onOpen={onOpen}
      classes={{ paper: classes.drawerPaper }}
    >
      <Toolbar>
        <OptFullLogo fill="#000" className={classes.logo} />
      </Toolbar>

      <List component={"nav"}>
        <CollapseListWrapper
          listOpen={listOpen}
          onCollapseChange={(key) => setListOpen(xor(listOpen, [key]))}
          label={"Allgemein"}
        >
          <ListItem
            component={NavLink}
            button
            to={"war-announcement"}
            activeClassName={"Mui-selected"}
          >
            <ListItemIcon>
              <NewReleases />
            </ListItemIcon>
            <ListItemText>
              <Typography>Schlachtankündigung</Typography>
            </ListItemText>
          </ListItem>
        </CollapseListWrapper>

        <CollapseListWrapper
          listOpen={listOpen}
          onCollapseChange={(key) => setListOpen(xor(listOpen, [key]))}
          label={"Statistiken"}
        >
          <ListItem
            button
            disabled // TODO enable the warEvent-Selection
            onClick={({ currentTarget }) =>
              setCampaignSelectorAnchorEl(currentTarget)
            }
          >
            <ListItemIcon>
              <Beenhere />
            </ListItemIcon>
            <ListItemText>
              <Typography>Schlachten</Typography>
            </ListItemText>
            <ChevronRight />
          </ListItem>
          <CampaignSelectorPopover
            anchorEl={campaignSelectorAnchorEl}
            onClose={() => setCampaignSelectorAnchorEl(null)}
          />
          <ListItem
            component={NavLink}
            button
            to={"/statistic/performance"}
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
            to={"/statistic/economy"}
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
            to={"/statistic/campaign-score"}
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
            to={"/statistic/player-table"}
            activeClassName={"Mui-selected"}
          >
            <ListItemIcon>
              <Group />
            </ListItemIcon>
            <ListItemText>
              <Typography>Spielerstatistiken</Typography>
            </ListItemText>
          </ListItem>
        </CollapseListWrapper>

        <CollapseListWrapper
          listOpen={listOpen}
          onCollapseChange={(key) => setListOpen(xor(listOpen, [key]))}
          label={"Externe Links"}
        >
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
        </CollapseListWrapper>

        <CollapseListWrapper
          listOpen={listOpen}
          onCollapseChange={(key) => setListOpen(xor(listOpen, [key]))}
          label={"Benutzer"}
        >
          {user ? (
            <ListItem disabled={loadingUser} button onClick={logout}>
              <ListItemIcon>
                <PowerSettingsNew />
              </ListItemIcon>
              <ListItemText>
                <Typography>Abmelden</Typography>
              </ListItemText>
            </ListItem>
          ) : (
            <ListItem disabled={loadingUser} button onClick={login}>
              <ListItemIcon>
                <Login />
              </ListItemIcon>
              <ListItemText>
                <Typography>Anmelden</Typography>
              </ListItemText>
            </ListItem>
          )}
        </CollapseListWrapper>
        <Divider />
      </List>
    </SwipeableDrawer>
  );
}

export default LeftDrawer;
