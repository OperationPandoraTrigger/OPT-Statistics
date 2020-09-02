import React, { useEffect } from "react";
import { now } from "moment";
import { useNavigate } from "react-router-dom";
import firebase from "firebase/app";
import CircularProgress from "@material-ui/core/CircularProgress";

function NavigateToLatestBattle(props) {
  const navigate = useNavigate();

  useEffect(() => {
    firebase
      .database()
      .ref(`battles`)
      .orderByChild("battleStart")
      .startAt(now())
      .limitToFirst(1)
      .once("value")
      .then((snapshot) => {
        const battleEvent = snapshot.val().pop();
        if (battleEvent) {
          navigate(
            `/battle-announcement/${battleEvent.campaignId}/${battleEvent.battleId}`,
            { replace: true }
          );
        }
      });
  }, []);
  return <CircularProgress />;
}

export default NavigateToLatestBattle;
