import React, { useEffect } from "react";
import { Avatar, Typography } from "@material-ui/core";
import firebase from "firebase/app";
import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";
import { useSearchParams } from "react-router-dom";
import { useLocalStorage } from "./helpers/useLocalStorage";

// TODO: move to firebase
export const STEAM_AUTHORITY_URL = "https://byte.pm/api/steam";

export const login = () => {
  fetch(STEAM_AUTHORITY_URL + "/authenticate", { mode: "cors" })
    .then((response) => response.text())
    .then((redirectUrl) => {
      if (redirectUrl) window.open(redirectUrl, "self");
    });
};

export const logout = () => {
  window.localStorage.clear();
  firebase.auth().signOut();
};

function Authenticator() {
  const [searchParams, setSearchParams] = useSearchParams({});
  const [steamProfile, setSteamProfile] = useLocalStorage("steamProfile");

  useEffect(() => {
    if (searchParams.has("openid.sig")) {
      fetch(STEAM_AUTHORITY_URL + "/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
        body: JSON.stringify(Object.fromEntries(searchParams.entries())),
      })
        .then((response) => response.json())
        .then((profile) => {
          setSteamProfile(profile);
          return firebase.auth().signInAnonymously(); // TODO LOGIN WITH JWT FROM BACKEND
        })
        .catch((err) => {
          console.error(err);
        })
        .finally(() => {
          setSearchParams();
        });
    }
  }, [searchParams, setSteamProfile, setSearchParams]);

  return (
    <Box ml={3}>
      {steamProfile?.personaname ? (
        <Box display={"flex"}>
          <Typography variant={"body2"}>{steamProfile.personaname}</Typography>
          <Avatar variant="square" src={steamProfile.avatar} />
        </Box>
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
