import { styles as BackdropStyles } from "@material-ui/core/Backdrop/Backdrop";
import { fade } from "@material-ui/core";

const ENROLL_HINT_BG_COLOR = fade(BackdropStyles.root.backgroundColor, 0.6);

export const ENROLL_PARTICIPANTS_STYLE = (theme) => ({
  enrollWrapper: {
    marginLeft: "auto",
    margin: theme.spacing(2),
  },
  enrollContainer: {
    display: "flex",
    position: "relative",
  },
  enrollButton: {
    justifyContent: "start",
    minWidth: "240px",
  },
  enrollHint: {
    ...BackdropStyles.root,
    borderRadius: theme.shape.borderRadius,
    padding: theme.spacing(4),
    position: "absolute",
    textAlign: "center",
    zIndex: 2,
    backgroundColor: ENROLL_HINT_BG_COLOR,
    color: theme.palette.getContrastText(ENROLL_HINT_BG_COLOR),
  },

  expand: {
    transform: "rotate(0deg)",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: "rotate(180deg)",
  },
  participantActionArea: {
    margin: theme.spacing(2),
    display: "flex",
    justifyContent: "space-between",
    width: "100%",
  },
  playerChip: {
    pointerEvents: "none",
    margin: theme.spacing(0.5),
  },
});

export default ENROLL_PARTICIPANTS_STYLE;
