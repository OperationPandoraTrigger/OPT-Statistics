import React from "react";
import * as ical from "cal-parser";
import { Button, Grid, MenuItem, Typography } from "@material-ui/core";
import { Select } from "mui-rff";
import { Form } from "react-final-form";
import BattleForm from "./battleForm";
import firebase from "firebase/app";

const EVENTS = ical
  .parseString("") // TODO: get File Uploader or httpLink running
  .events.map(({ dtstart, summary, dtend }) => {
    return {
      battleId: null,
      battleComment:
        "Kriegsreportern wird es gestattet das Schlachtfeld zu betreten.",
      battleEnd: +dtend.value, // time
      battleName: summary.value,
      battleStart: +dtstart.value, // time
      factionSide: {
        arf: "csat",
        sword: "aaf",
      },
    };
  })
  .sort((a, b) => a.battleStart - b.battleStart)
  .map((event, i) => {
    return {
      ...event,
      factionSide: {
        arf: i > 7 ? "csat" : "aaf",
        sword: i > 7 ? "aaf" : "csat",
      },
    };
  });

const campaigns = [
  "Unter falscher Flagge",
  "Green Hell",
  "Ernte gut, alles Gut",
  "Aufstand des Lumpenproletariats",
];

const handleImport = (formData) => {
  const battleListRef = firebase.database().ref(`battles`);
  return Promise.allSettled(
    formData.battles.map((battle) =>
      battleListRef.push({
        ...battle,
        battleEnd: +battle.battleEnd,
        battleStart: +battle.battleStart,
        campaignId: formData.campaignId,
      })
    )
  );
};

function ImportIcsCampaign() {
  return (
    <Form
      onSubmit={handleImport}
      initialValues={{
        campaignId: campaigns[3],
        battles: EVENTS,
      }}
      render={({ handleSubmit, submitting }) => (
        <form noValidate={true} onSubmit={handleSubmit}>
          <Grid container spacing={6}>
            <Grid item xs={12}>
              <Select
                label="Kampagne"
                name="campaignId"
                helperText="Name der Kampagne"
              >
                {campaigns.map((campaign) => (
                  <MenuItem key={campaign} value={campaign}>
                    {campaign}
                  </MenuItem>
                ))}
              </Select>
            </Grid>
            <Grid item>
              <Typography variant={"h3"}>
                TODO ical Upload/Link and parsing
              </Typography>
            </Grid>
            {EVENTS.map((event, i) => {
              return <BattleForm key={event.battleStart} i={i} />;
            })}
            <Grid item xs={12}>
              <Button
                type={"submit"}
                size={"large"}
                color={"secondary"}
                variant={"contained"}
                disabled={submitting}
              >
                Import
              </Button>
            </Grid>
          </Grid>
        </form>
      )}
    />
  );
}

export default ImportIcsCampaign;
