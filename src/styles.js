import { makeStyles } from "@material-ui/core/styles";
import ENROLL_PARTICIPANTS_STYLE from "./components/battleAnnouncement/battleParticipants/battleParticipants.style";
import PARTICIPANT_GAUGE_STYLE from "./components/battleAnnouncement/battleParticipants/participantGauge.style";

export const DRAWER_WIDTH = 252;

export const useStyles = makeStyles(
  (theme) => ({
    ...ENROLL_PARTICIPANTS_STYLE(theme),
    ...PARTICIPANT_GAUGE_STYLE(theme),
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
      [theme.breakpoints.up("lg")]: {
        width: `calc(100% - ${DRAWER_WIDTH}px)`,
      },
    },
    drawer: {
      width: DRAWER_WIDTH,
      flexShrink: 0,
    },
    drawerPaper: {
      width: DRAWER_WIDTH,
    },
    appBar: {
      [theme.breakpoints.up("lg")]: {
        width: `calc(100% - ${DRAWER_WIDTH}px)`,
        marginLeft: DRAWER_WIDTH,
      },
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
    captionInlineBox: {
      display: "inline-block",
      margin: theme.spacing(1, 2),
    },
    captionBlockBox: {
      margin: theme.spacing(1, 2),
    },
    battleNavigator: {
      display: "flex",
      justifyItems: "center",
      alignItems: "stretch",
      justifyContent: "space-between",
    },
    sectorName: {
      minWidth: "89px",
    },
  }),
  { index: 1 } // jss way to say: !important
);
