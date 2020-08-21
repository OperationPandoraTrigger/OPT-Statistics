import React from "react";
import Toolbar from "@material-ui/core/Toolbar";
import { SvgIcon, Typography } from "@material-ui/core";
import { OptFullLogo } from "../svg";
import AppBar from "@material-ui/core/AppBar";
import { useStyles } from "../styles";

function TopAppBar(props) {
  const classes = useStyles();

  return (
    <AppBar position="fixed" className={classes.appBar}>
      <Toolbar>
        <OptFullLogo className={classes.appBarLogo} />
        <Typography variant="h6" noWrap>
          Operation Pandora Trigger
        </Typography>
      </Toolbar>
    </AppBar>
  );
}

export default TopAppBar;
