import { makeStyles } from "@material-ui/core/styles";

export const DRAWER_WIDTH = 240;

export const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  backdrop: {
    left: DRAWER_WIDTH,
    zIndex: theme.zIndex.drawer,
  },
  toolbar: theme.mixins.toolbar,
  main: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  drawer: {
    width: DRAWER_WIDTH,
    flexShrink: 0,
  },
  drawerPaper: {
    width: DRAWER_WIDTH,
  },
}));
