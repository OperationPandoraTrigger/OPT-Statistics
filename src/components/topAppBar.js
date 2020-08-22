import React from "react";
import Toolbar from "@material-ui/core/Toolbar";
import { Hidden, Typography, IconButton } from "@material-ui/core";
import { OptFullLogo } from "../svg";
import AppBar from "@material-ui/core/AppBar";
import { Menu } from "@material-ui/icons";
import { useTopAppBarStyles } from "./topAppBar.style";

function TopAppBar() {
  const classes = useTopAppBarStyles();
  return (
    <AppBar position="fixed" className={classes.root}>
      <Toolbar>
        <IconButton
          edge="start"
          className={classes.menuButton}
          color="inherit"
          aria-label="menu"
        >
          <Menu />
        </IconButton>
        <OptFullLogo className={classes.logo} />
        <Hidden xsDown>
          <Typography variant="h6" noWrap>
            Operation Pandora Trigger
          </Typography>
        </Hidden>
      </Toolbar>
    </AppBar>
  );
}

export default TopAppBar;
