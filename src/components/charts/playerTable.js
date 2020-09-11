import React, { forwardRef } from "react";
import MaterialTable from "material-table";
import ArrowDownward from "@material-ui/icons/ArrowDownward";
import { AttachMoney, Person } from "@material-ui/icons";
import { SvgIcon } from "@material-ui/core";
import {
  FlagTouchIcon,
  FriendlyFireIcon,
  KillIcon,
  ReviveIcon,
  UnconciousIcon,
} from "../../svg/scoreboard";

const playerColumns = [
  {
    tooltip: "Spielername",
    title: (
      <>
        <Person />
      </>
    ),
    field: "name",
  },
  {
    tooltip: "Abschüsse",
    title: (
      <>
        <SvgIcon>
          <KillIcon />
        </SvgIcon>
      </>
    ),
    field: "kills",
    type: "numeric",
    defaultSort: "desc",
  },
  {
    tooltip: "Eigenbeschuss",
    title: (
      <>
        <SvgIcon>
          <FriendlyFireIcon />
        </SvgIcon>
      </>
    ),
    field: "friendlyFires",
    type: "numeric",
  },
  {
    tooltip: "Wiederbelebung",
    title: (
      <>
        <SvgIcon>
          <ReviveIcon />
        </SvgIcon>
      </>
    ),
    field: "revives",
    type: "numeric",
  },
  {
    tooltip: "Eroberungen",
    title: (
      <>
        <SvgIcon>
          <FlagTouchIcon />
        </SvgIcon>
      </>
    ),
    field: "captures",
    type: "numeric",
  },
  // {
  //   tooltip: "Fahrzeug (Leicht)",
  //   title: (
  //     <>
  //       <SvgIcon>
  //         <VehicleLightIcon />
  //       </SvgIcon>
  //     </>
  //   ),
  //   field: "lightVehicle",
  //   type: "numeric",
  // },
  // {
  //   tooltip: "Fahrzeug (Schwer)",
  //   title: (
  //     <>
  //       <SvgIcon>
  //         <VehicleHeavyIcon />
  //       </SvgIcon>
  //     </>
  //   ),
  //   field: "heavyVehicle",
  //   type: "numeric",
  // },
  // {
  //   tooltip: "Fahrzeug (Luft)",
  //   title: (
  //     <>
  //       <SvgIcon>
  //         <VehicleAirIcon />
  //       </SvgIcon>
  //     </>
  //   ),
  //   field: "airVehicle",
  //   type: "numeric",
  // },
  // {
  //   tooltip: "Passagier Flugdistanz",
  //   title: (
  //     <>
  //       <SvgIcon>
  //         <KillIcon />
  //       </SvgIcon>
  //     </>
  //   ),
  //   field: "traveled",
  // },
  // {
  //   tooltip: "Pilot Flugdistanz",
  //   title: (
  //     <>
  //       <SvgIcon>
  //         <TravelDistanceIcon />
  //       </SvgIcon>
  //     </>
  //   ),
  //   field: "carried",
  // },
  {
    tooltip: "Bewusstlosigkeit",
    title: (
      <>
        <SvgIcon>
          <UnconciousIcon />
        </SvgIcon>
      </>
    ),
    field: "passOuts",
    type: "numeric",
  },
  {
    tooltip: "Geld ausgegeben",
    title: (
      <>
        <SvgIcon>
          <AttachMoney />
        </SvgIcon>
      </>
    ),
    field: "moneySpent",
    type: "currency",
    currencySetting: {
      locale: "de-DE",
      currency: "EUR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    },
  },
  // {
  //   tooltip: "Tode",
  //   title: (
  //     <>
  //       <SvgIcon>
  //         <KillIcon />
  //       </SvgIcon>
  //     </>
  //   ),
  //   field: "died",
  //   type: "numeric",
  // },
];
const tableIcons = {
  SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
};

function PlayerTable({ playerStats }) {
  return (
    <MaterialTable
      icons={tableIcons}
      columns={playerColumns}
      data={Object.values(playerStats)}
      options={{
        tableLayout: "auto",
        padding: "dense",
        filtering: false,
        grouping: false,
        search: false,
        selection: false,
        paging: false,
        sorting: true,
        // fixedColumns: { left: 1 },
      }}
    />
  );
}

export default PlayerTable;
