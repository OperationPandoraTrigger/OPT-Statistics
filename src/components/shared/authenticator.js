import React from "react";
import { Typography } from "@material-ui/core";
import { useAuthState } from "react-firebase-hooks/auth";
import firebase from "firebase/app";
import "firebase/auth";
import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";

export const login = () => {
  firebase.auth().signInAnonymously();
  //firebase.auth().signInWithRedirect("https://steamcommunity.com/openid");
};

export const logout = () => {
  firebase.auth().signOut();
};

function Authenticator() {
  const [user] = useAuthState(firebase.auth());

  return (
    <Box ml={3}>
      {user ? (
        <Typography variant={"body2"}>Hallo, {user.uid}</Typography>
      ) : (
        <Button onClick={login}>
          <img
            src="https://steamcommunity-a.akamaihd.net/public/images/signinthroughsteam/sits_01.png"
            alt={"Login via Steam"}
          />
        </Button>
      )}
    </Box>
  );
}

export default Authenticator;
