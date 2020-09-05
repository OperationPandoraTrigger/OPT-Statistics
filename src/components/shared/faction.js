const factionTranslations = {
  arf: {
    simple: "ARF",
    short: "A.R.F",
    long: "Altis Republic Forces",
  },
  sword: {
    simple: "SWORD",
    short: "S.W.O.R.D",
    long: "Strategic Weaponized Operational Response Division",
  },
  opt: {
    simple: "OPT",
    short: "OPT",
    long: "Operation Pandora Trigger",
  },
  undefined: {
    simple: "???",
    short: "Unbekannt",
    long: "Unbekannte Fraktion",
  },
};

export const SIDE_TO_COLOR_MAP = {
  aaf: "green",
  csat: "red",
  nato: "blue",
};

function Faction({ factionKey = undefined, style = "short" }) {
  return factionTranslations[factionKey][style];
}

export default Faction;
