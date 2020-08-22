import { makeStyles } from "@material-ui/core/styles";

export const useTopAppBarStyles = makeStyles((theme) => ({
  root: {
    zIndex: theme.zIndex.drawer + 1,
  },
  logo: {
    width: "auto",
    height: 64,
    marginRight: theme.spacing(2),
    padding: theme.spacing(1, 0),
    [theme.breakpoints.down("xs")]: {
      margin: "0 auto",
    },
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
}));
