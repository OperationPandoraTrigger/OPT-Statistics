import { makeStyles } from "@material-ui/core/styles";

const drawerWidth = 240;

export const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  appBarLogo: {
    width: "auto",
    height: 64,
    marginRight: theme.spacing(2),
    padding: theme.spacing(1, 0),
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up("sm")]: {
      display: "none",
    },
  },
  toolbar: theme.mixins.toolbar,
  main: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
}));
