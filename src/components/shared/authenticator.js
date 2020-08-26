import React, { useEffect, useState } from "react";
import { Typography } from "@material-ui/core";
import * as firebase from "firebase/app";
import "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBvUv_Li0UnU_ypDnFwQ47EuwJDX_imdBg",
  authDomain: "opt-stats.firebaseapp.com",
  databaseURL: "https://opt-stats.firebaseio.com",
  projectId: "opt-stats",
  storageBucket: "opt-stats.appspot.com",
  messagingSenderId: "412471479558",
  appId: "1:412471479558:web:7404e841f4c882c9df6287",
};
firebase.initializeApp(firebaseConfig);

function Authenticator() {
  const [user, setUser] = useState(null);
  useEffect(() => {
    firebase.auth().signInAnonymously();

    firebase.auth().onAuthStateChanged(function (user) {
      console.debug(user);
      setUser(user);
    });
  }, []);

  return (
    <div>
      {user ? (
        <Typography>Hallo, {user.displayName}</Typography>
      ) : (
        <a href={"#"}>
          <img
            src="https://steamcommunity-a.akamaihd.net/public/images/signinthroughsteam/sits_01.png"
            alt={"Login via Steam"}
          />
        </a>
      )}
    </div>
  );
}

export default Authenticator;
