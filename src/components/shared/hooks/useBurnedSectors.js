import { useListVals } from "react-firebase-hooks/database";
import { useEffect, useState } from "react";
import firebase from "firebase/app";

function useBurnedSectors(until) {
  const [sectorEnumeration, setSectorEnumeration] = useState([]);

  useEffect(() => {
    if (until) {
      const ref = firebase
        .database()
        .ref(`battles`)
        .orderByChild("battleStart")
        .endAt(until);

      const off = ref.on("value", (snapshot) => {
        const battles = snapshot?.val();
        const battlesWithAttackingSector = battles?.filter(
          (b) => !!b.attackingSector
        );

        setSectorEnumeration(
          battlesWithAttackingSector?.flatMap(({ attackingSector }) => {
            return Object.values(attackingSector);
          })
        );
      });

      return () => off();
    } else {
      setSectorEnumeration([]);
    }
  }, [until]);

  return sectorEnumeration;
}

export default useBurnedSectors;
