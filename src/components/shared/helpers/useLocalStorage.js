import { useState } from "react";

/***
 *  TODO dunno where to store typings, yet
 *
 avatar: "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/ad/ad31fda82eda3600385bc00cc4551614b3e02bf9.jpg"
 avatarfull: "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/ad/ad31fda82eda3600385bc00cc4551614b3e02bf9_full.jpg"
 avatarhash: "ad31fda82eda3600385bc00cc4551614b3e02bf9"
 avatarmedium: "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/ad/ad31fda82eda3600385bc00cc4551614b3e02bf9_medium.jpg"
 commentpermission: 1
 communityvisibilitystate: 3
 lastlogoff: 1598899580
 personaname: "Frozen_byte"
 personastate: 1
 personastateflags: 0
 primaryclanid: "103582791429969206"
 profilestate: 1
 profileurl: "https://steamcommunity.com/id/frozen_byte/"
 steamid: "76561198052374323"
 timecreated: 1321058236
 *
 ***/

// Credits  to https://usehooks.com/useLocalStorage/
export function useLocalStorage(key, initialValue) {
  // State to store our value
  // Pass initial state function to useState so logic is only executed once
  const [storedValue, setStoredValue] = useState(() => {
    try {
      // Get from local storage by key
      const item = window.localStorage.getItem(key);
      // Parse stored json or if none return initialValue
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      // If error also return initialValue
      console.log(error);
      return initialValue;
    }
  });

  // Return a wrapped version of useState's setter function that ...
  // ... persists the new value to localStorage.
  const setValue = (value) => {
    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      // Save state
      setStoredValue(valueToStore);
      // Save to local storage
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      // A more advanced implementation would handle the error case
      console.log(error);
    }
  };

  return [storedValue, setValue];
}
