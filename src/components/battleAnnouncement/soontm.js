import React from "react";
import { Typography } from "@material-ui/core";
import ImportIcsCampaign from "../admin/importIcsCampaign";

function Soontm() {
  return (
    <div>
      <Typography variant={"h4"}>Keine nächste Schlacht</Typography>
      <Typography variant={"body2"}>
        Es wurde keine nächste Schlacht angemeldet
      </Typography>
      <ImportIcsCampaign />
    </div>
  );
}

export default Soontm;
