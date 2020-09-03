import React, { useEffect, useState } from "react";
import { Typography } from "@material-ui/core";
import { useListVals } from "react-firebase-hooks/database";
import firebase from "firebase/app";

function BurnedSectors({ until = 0 }) {
  const [battles] = useListVals(
    firebase
      .database()
      .ref(`battles`)
      .orderByChild("battleStart")
      .endAt(until - 1) // do not include own match
  );
  const [sectorEnumeration, setSectorEnumeration] = useState("keine");

  useEffect(() => {
    setSectorEnumeration(
      battles
        ?.filter((b) => !!b.attackingSector)
        ?.map(({ attackingSector }) => {
          return "#" + Object.values(attackingSector).join(", #");
        })
        .join(", ") || "keine"
    );
  }, [battles]);

  return (
    <div>
      <Typography variant={"h4"}>Verbrannte Sektoren</Typography>
      <Typography variant={"body2"}>{sectorEnumeration}</Typography>
    </div>
  );
}

export default BurnedSectors;
