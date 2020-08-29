import React, { useEffect, useState } from "react";
import { Check, Event, EventAvailable, EventBusy } from "@material-ui/icons";
import { Button, ButtonGroup } from "@material-ui/core";
import CircularProgress from "@material-ui/core/CircularProgress";
import { useStyles } from "../../styles";
import firebase from "firebase/app";
import "firebase/database";
import { useObjectVal } from "react-firebase-hooks/database";
import { useAuthState } from "react-firebase-hooks/auth";
import { delay } from "./helpers/delay";

function WarEventEnroll({ warEventId }) {
  const classes = useStyles();
  const [databaseRef, setDatabaseRef] = useState();

  const [inTransaction, setInTransaction] = useState();

  const [user] = useAuthState(firebase.auth());
  const [warEventParticipants, loadingRead] = useObjectVal(databaseRef);
  const enrollState = warEventParticipants?.state;

  useEffect(() => {
    if (user?.uid) {
      setDatabaseRef(
        firebase
          .database()
          .ref(`warEvents/${warEventId}/participants/${user.uid}`)
      );
    } else {
      setDatabaseRef(null);
    }
  }, [user, warEventId]);
  const setEnrollState = (state) => {
    setInTransaction(state);
    if (user) {
      databaseRef
        .transaction((participants) => {
          if (participants) {
            // update
            participants.state = state;
          } else {
            // whoopsie no side?
            const side = "arf";
            return { side, state };
          }
          return participants;
        })
        .then(() => delay(500))
        .finally(() => setInTransaction(null));
    }
  };

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
    onClick: () => setEnrollState(value),
  });

  return (
    <ButtonGroup disabled={loadingRead} orientation="vertical" disableElevation>
      <Button {...getButtonProps("yes", <EventAvailable />)}>Ja</Button>
      <Button {...getButtonProps("no", <EventBusy />)}>Nein</Button>
      <Button {...getButtonProps("maybe", <Event />)}>Vielleicht</Button>
    </ButtonGroup>
  );
}

export default WarEventEnroll;
