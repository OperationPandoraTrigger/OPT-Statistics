import React, { useState } from "react";
import { Check, Event, EventAvailable, EventBusy } from "@material-ui/icons";
import { Button, ButtonGroup } from "@material-ui/core";
import CircularProgress from "@material-ui/core/CircularProgress";
import { useStyles } from "../../styles";

function BattleEnrollButtonGroup({ enrollState, onEnrollStateChange }) {
  const classes = useStyles();
  const [inTransaction, setInTransaction] = useState();

  const getButtonProps = (value, startIcon) => ({
    className: classes.enrollButton,
    startIcon:
      inTransaction === value ? (
        <CircularProgress color={"inherit"} size={17} />
      ) : value === enrollState ? (
        <Check />
      ) : (
        startIcon
      ),
    color: enrollState === value ? "primary" : "inherit",
    variant: enrollState === value ? "contained" : "outlined",
    onClick: () => {
      setInTransaction(value);
      onEnrollStateChange(value).finally(() => setInTransaction(null));
    },
  });

  return (
    <ButtonGroup orientation="vertical" disableElevation>
      <Button {...getButtonProps("yes", <EventAvailable />)}>Ja</Button>
      <Button {...getButtonProps("no", <EventBusy />)}>Nein</Button>
      <Button {...getButtonProps("maybe", <Event />)}>Vielleicht</Button>
    </ButtonGroup>
  );
}

export default BattleEnrollButtonGroup;
