import React from "react";
import CampaignSelector from "./campaignSelector";
import Popover from "@material-ui/core/Popover";

function CampaignSelectorPopover({ onClose, anchorEl }) {
  return (
    <Popover
      open={!!anchorEl}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "left",
      }}
    >
      <CampaignSelector campaignId={"0"} />
    </Popover>
  );
}

export default CampaignSelectorPopover;
