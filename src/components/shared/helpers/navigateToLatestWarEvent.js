import React, { useEffect } from "react";
import { now } from "moment";
import { useNavigate } from "react-router-dom";
import firebase from "firebase/app";
import LinearProgress from "@material-ui/core/LinearProgress";

function NavigateToLatestBattle() {
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
        if (snapshot.val()) {
          const battleEvent = Object.values(snapshot.val()).pop();
          if (battleEvent) {
            navigate(`/battle-announcement/${battleEvent.battleId}`, {
              replace: true,
            });
          }
        } else {
          // no latest battle found
          navigate(`/battle-announcement/soontm`, {
            replace: true,
          });
        }
      });
  }, [navigate]);
  return <LinearProgress color={"secondary"} />;
}

export default NavigateToLatestBattle;
