export const PARTICIPANT_GAUGE_STYLE = (theme) => ({
  participantGauge: {
    display: "flex",
    position: "relative",
    width: theme.typography.h1.fontSize,
    height: theme.typography.h1.fontSize,
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
  gaugeCounter: {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    position: "absolute",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default PARTICIPANT_GAUGE_STYLE;
