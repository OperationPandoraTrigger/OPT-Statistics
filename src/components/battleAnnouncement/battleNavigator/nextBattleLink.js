import firebase from "firebase";
import Button from "@material-ui/core/Button";
import { Link } from "react-router-dom";
import { ChevronRight } from "@material-ui/icons";
import React, { useEffect, useState } from "react";

function NextBattleLink({ currentBattleStart }) {
  const [battle, setBattle] = useState(undefined);

  useEffect(() => {
    if (currentBattleStart) {
      firebase
        .database()
        .ref(`battles`)
        .orderByChild("battleStart")
        .startAfter(currentBattleStart)
        .limitToFirst(1)
        .once("value")
        .then((snapshot) => {
          if (snapshot.exists() && snapshot.numChildren() === 1) {
            // will only loop once
            snapshot.forEach((childSnapshot) => {
              setBattle({
                ...childSnapshot.val(),
                key: childSnapshot.key,
              });
            });
          } else {
            setBattle(undefined);
          }
        });
    }
  }, [currentBattleStart]);

  return (
    <Button
      disabled={!battle?.battleName}
      component={Link}
      to={`/battle-announcement/${battle?.key}`}
    >
      {battle?.battleName}&nbsp;
      <ChevronRight />
    </Button>
  );
}

export default NextBattleLink;
