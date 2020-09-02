import React from "react";
import Avatar from "@material-ui/core/Avatar";
import Chip from "@material-ui/core/Chip";
import { Cancel, Check, Remove } from "@material-ui/icons";
import { useStyles } from "../../styles";

const stateIconMap = {
  yes: <Check />,
  no: <Cancel />,
  maybe: <Remove />,
};

function PlayerChip({ state, label, avatarSrc }) {
  const classes = useStyles();

  return (
    <Chip
      avatar={<Avatar alt={label} src={avatarSrc} />}
      label={label}
      size={"small"}
      onDelete // fake deletable for easy right-sided icon
      className={classes.playerChip} // but disable interaction
      deleteIcon={stateIconMap[state]}
      variant="outlined"
    />
  );
}

export default PlayerChip;
