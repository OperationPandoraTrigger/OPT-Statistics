import { DateTimePicker, Radios, TextField } from "mui-rff";
import { Grid, makeStyles, Paper } from "@material-ui/core";

const RADIOS_DATA = [
  {
    label: "AAF",
    value: "aaf",
    formControlLabelProps: { labelPlacement: "start" },
  },
  {
    label: "CSAT",
    value: "csat",
    formControlLabelProps: { labelPlacement: "end" },
  },
];
const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(3),
  },
}));

const BattleForm = ({ i }) => {
  const classes = useStyles();

  return (
    <Grid item>
      <Paper className={classes.paper}>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextField
              name={`battles[${i}].battleName`}
              label={"Schlacht"}
              helperText={"Name der Schlacht. Seitenwechsel/Finalschlacht"}
              size={"small"}
            />
          </Grid>
          <Grid item xs={3}>
            <DateTimePicker
              name={`battles[${i}].battleStart`}
              label={"Schlachtbeginn"}
              helperText={"Datum und Zeit 19:30"}
              size={"small"}
              ampm={false}
            />
          </Grid>
          <Grid item xs={3}>
            <DateTimePicker
              name={`battles[${i}].battleEnd`}
              label={"Schlachtende"}
              helperText={"Datum und Zeit 22:30"}
              size={"small"}
              ampm={false}
            />
          </Grid>
          <Grid item xs={3}>
            <Radios
              label="ARF"
              name={`battles[${i}].factionSide.arf`}
              helperText={"Wähle eine Seite"}
              data={RADIOS_DATA}
              size={"small"}
              radioGroupProps={{ row: true }}
            />
          </Grid>
          <Grid item xs={3}>
            <Radios
              label="SWORD"
              name={`battles[${i}].factionSide.sword`}
              helperText={"Wähle eine Seite"}
              data={RADIOS_DATA}
              size={"small"}
              radioGroupProps={{ row: true }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              size={"small"}
              name={`battles[${i}].battleComment`}
              label={"Kommentar"}
              helperText={"Zusätzliche Informationen zur Schlacht"}
              multiline
              maxRows={4}
            />
          </Grid>
        </Grid>
      </Paper>
    </Grid>
  );
};

export default BattleForm;
