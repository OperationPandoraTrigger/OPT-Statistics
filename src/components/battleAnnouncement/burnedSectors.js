import React from "react";
import { Typography } from "@material-ui/core";
import useBurnedSectors from "../shared/hooks/useBurnedSectors";

function BurnedSectors({ until }) {
  const burnedSectors = useBurnedSectors(until - 1); // do not include own battle

  return (
    <div>
      <Typography variant={"h4"}>Verbrannte Sektoren</Typography>
      <Typography variant={"body2"}>
        {burnedSectors.map((v) => `#${v}`).join(", ")}
      </Typography>
    </div>
  );
}

export default BurnedSectors;
