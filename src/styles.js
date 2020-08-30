import { makeStyles } from "@material-ui/core/styles";

export const DRAWER_WIDTH = 240;
export const DRAWER_WIDTH_COLLAPSED = 58;

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
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  logo: {
    width: "auto",
    height: 64,
    maxHeight: 64,
    lineHeight: 64,
    marginRight: theme.spacing(2),
    padding: theme.spacing(1, 0),
    [theme.breakpoints.down("xs")]: {
      margin: "0 auto",
    },
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  enrollButton: {
    justifyContent: "start",
  },
  progressSecondary: {
    color: theme.palette.primary.light,
  },
  progressPrimary: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    color: theme.palette.primary.dark,
  },
  captionInlineBox: {
    display: "inline-block",
    margin: theme.spacing(1, 2),
  },
  captionBlockBox: {
    margin: theme.spacing(1, 2),
  },
}));
