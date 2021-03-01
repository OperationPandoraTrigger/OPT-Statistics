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
  ChatBubble,
  EmojiEvents,
  LocationOn,
  Login,
  MultilineChart,
  NewReleases,
  PowerSettingsNew,
} from "@material-ui/icons";
import { useStyles } from "../../styles";
import { Link, NavLink, useLocation } from "react-router-dom";
import { OptFullLogo } from "../../svg";
import { login, logout } from "../shared/authenticator";
import { useAuthState } from "react-firebase-hooks/auth";
import firebase from "firebase/app";
import { xor } from "lodash";
import CollapseListWrapper from "./collapseListWrapper";
import { useTheme } from "@material-ui/core/styles";

function LeftDrawer({ open, onClose, onOpen }) {
  const classes = useStyles();
  const theme = useTheme();
  const [listOpen, setListOpen] = useState(["Allgemein", "Statistiken"]);
  const mediaQuery = useMediaQuery(theme.breakpoints.up("lg"));
  const [user, loadingUser] = useAuthState(firebase.auth());
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
            href={"https://stats.opt4.net:2021/"}
            activeClassName={"Mui-selected"}
          >
            <ListItemIcon>
              <MultilineChart />
            </ListItemIcon>
            <ListItemText>
              <Typography>Statistiken</Typography>
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
