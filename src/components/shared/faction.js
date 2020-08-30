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
  undefined: {
    simple: "???",
    short: "Unbekannt",
    long: "Unbekannte Fraktion",
  },
};

function Faction({ factionKey = undefined, style = "short" }) {
  return factionTranslations[factionKey][style];
}

export default Faction;
