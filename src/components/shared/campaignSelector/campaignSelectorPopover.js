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
      <CampaignSelector
        campaignEvent={{
          campaignId: "1",
          campaignDate: new Date(),
          campaignName: "Ernte gut, alles gut",
        }}
        warEvents={[
          {
            matchId: "1.1",
            matchDate: new Date(),
            matchName: "Schlacht 1",
          },
          {
            matchId: "1.2",
            matchDate: new Date(),
            matchName: "Schlacht 2",
          },
          {
            matchId: "1.3",
            matchDate: new Date(),
            matchName: "Schlacht 3",
          },
          {
            matchId: "1.4",
            matchDate: new Date(),
            matchName: "Schlacht 4",
          },
          {
            matchId: "1.5",
            matchDate: new Date(),
            matchName: "Schlacht 5",
          },
          {
            matchId: "1.6",
            matchDate: new Date(),
            matchName: "Schlacht 6",
          },
          {
            matchId: "1.7",
            matchDate: new Date(),
            matchName: "Schlacht 7",
          },
          {
            matchId: "1.8",
            matchDate: new Date(),
            matchName: "Schlacht 8",
          },
          {
            matchId: "1.9",
            matchDate: new Date(),
            matchName: "Schlacht 9",
          },
          {
            matchId: "1.10",
            matchDate: new Date(),
            matchName: "Schlacht 10",
          },
          {
            matchId: "1.11",
            matchDate: new Date(),
            matchName: "Schlacht 11",
          },
          {
            matchId: "1.12",
            matchDate: new Date(),
            matchName: "Schlacht 12",
          },
          {
            matchId: "1.13",
            matchDate: new Date(),
            matchName: "Schlacht 13",
          },
          {
            matchId: "1.14",
            matchDate: new Date(),
            matchName: "Schlacht 14",
          },
          {
            matchId: "1.15",
            matchDate: new Date(),
            matchName: "Schlacht 15",
          },
          {
            matchId: "1.16",
            matchDate: new Date(),
            matchName: "Schlacht 16",
          },
          {
            matchId: "1.17",
            matchDate: new Date(),
            matchName: "Schlacht 17",
          },
          {
            matchId: "1.18",
            matchDate: new Date(),
            matchName: "Schlacht 18",
          },
          {
            matchId: "1.19",
            matchDate: new Date(),
            matchName: "Schlacht 19",
          },
        ]}
      />
    </Popover>
  );
}

export default CampaignSelectorPopover;
