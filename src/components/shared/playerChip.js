import React from "react";
import Avatar from "@material-ui/core/Avatar";
import Chip from "@material-ui/core/Chip";

function PlayerChip({ label, avatarSrc }) {
  return (
    <Chip
      avatar={<Avatar alt={label} src={avatarSrc} />}
      label={label}
      variant="outlined"
    />
  );
}

export default PlayerChip;
