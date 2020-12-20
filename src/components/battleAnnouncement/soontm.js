import React from "react";
import { Typography } from "@material-ui/core";

function Soontm({ until }) {
  return (
    <div>
      <Typography variant={"h4"}>Keine nächste Schlacht</Typography>
      <Typography variant={"body2"}>
        Es wurde keine nächste Schlacht angemeldet
      </Typography>
    </div>
  );
}

export default Soontm;
