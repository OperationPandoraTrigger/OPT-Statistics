import React, { useState } from "react";
import ToggleButton from "@material-ui/lab/ToggleButton";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";
import { Event, EventAvailable, EventBusy } from "@material-ui/icons";
import { Button } from "@material-ui/core";

const WarEventEnroll = () => {
  const [enrollState, setEnrollState] = useState(null);
  return (
    <div>
      <ToggleButtonGroup
        orientation="vertical"
        value={enrollState}
        exclusive
        onChange={(event, value) => setEnrollState(value)}
      >
        <ToggleButton
          component={Button}
          value="yes"
          startIcon={<EventAvailable />}
        >
          Ja
        </ToggleButton>
        <ToggleButton component={Button} value="no" startIcon={<EventBusy />}>
          Nein
        </ToggleButton>
        <ToggleButton component={Button} value="maybe" startIcon={<Event />}>
          Vielleicht
        </ToggleButton>
      </ToggleButtonGroup>
    </div>
  );
};

export default WarEventEnroll;
