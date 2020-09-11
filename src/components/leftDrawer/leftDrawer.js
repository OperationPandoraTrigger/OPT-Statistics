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
  useMediaQuery,
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
import { Link, NavLink } from "react-router-dom";
import CampaignSelectorPopover from "../shared/campaignSelector/campaignSelectorPopover";
import { OptFullLogo } from "../../svg";
import { login, logout } from "../shared/authenticator";
import { useAuthState } from "react-firebase-hooks/auth";
import firebase from "firebase/app";
import { xor } from "lodash";
import CollapseListWrapper from "./collapseListWrapper";
import { useLocation } from "react-router-dom";
import { useTheme } from "@material-ui/core/styles";

function LeftDrawer({ open, onClose, onOpen }) {
  const classes = useStyles();
  const theme = useTheme();
  const [listOpen, setListOpen] = useState(["Allgemein", "Statistiken"]);
  const mediaQuery = useMediaQuery(theme.breakpoints.up("lg"));
  const [user, loadingUser] = useAuthState(firebase.auth());
  const [campaignSelectorAnchorEl, setCampaignSelectorAnchorEl] = useState(
    null
  );
  let location = useLocation();

  useEffect(() => {
    onClose(); // close on navigation
    // we do not wanna execute if "onClose" prop changes, only on location
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  return (
    <SwipeableDrawer
      className={classes.drawer}
      anchor={"left"}
      open={open}
      onClose={onClose}
      onOpen={onOpen}
      variant={mediaQuery ? "permanent" : "temporary"}
      classes={{ paper: classes.drawerPaper }}
    >
      <Toolbar>
        <Link to={"/battle-announcement/latest"}>
          <OptFullLogo fill="#000" className={classes.logo} />
        </Link>
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
            to={"battle-announcement"}
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
            disabled // TODO enable the battleEvent-Selection
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
            rel="noopener noreferrer"
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
            rel="noopener noreferrer"
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
            rel="noopener noreferrer"
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
