/* eslint import/no-webpack-loader-syntax: off */
import React, {useEffect, useMemo, useState} from 'react';
import './App.css';
import {Line, Radar} from 'react-chartjs-2';
import {duration, utc} from "moment";
import {useSortBy, useTable} from "react-table";
import {DEMOLOG} from "./log";

const LINE_TOOLTIP = {
    callbacks: {
        title: (tooltipItem, data) => {
            const {t} = data.datasets[tooltipItem[0].datasetIndex].data[tooltipItem[0].index];
            return utc(t).format('HH:mm:ss');
        },
        footer: (tooltipItem, data) => {
            const {line} = data.datasets[tooltipItem[0].datasetIndex].data[tooltipItem[0].index];
            return line;
        }
    },
    position: 'nearest',
    mode: 'index',
    intersect: false
};
const GAMETIME_SCALE = {
    type: 'time',
    distribution: 'linear',
    bounds: 'data',
    ticks: {
        min: 0,
    //    max: 9005000
    },
    time: {
        unit: 'second',
        displayFormats: {
            'millisecond': 'HH:mm',
            'second': 'HH:mm',
            'minute': 'HH:mm',
            'hour': 'HH:mm',
            'day': 'HH:mm',
            'week': 'HH:mm',
            'month': 'HH:mm',
            'quarter': 'HH:mm',
            'year': 'HH:mm',
        },
    },
};

const scoreDatasets = [];
const dominationDatasets = [];
const budgetDatasets = [];
const playerStats = {};
const playerColumns = [
    {
        Header: 'Spielername',
        accessor: 'name'
    },
    {
        Header: 'Abschüsse',
        accessor: 'kills'
    },
    {
        Header: 'Eigenbeschuss',
        accessor: 'friendlyFires'
    },
    {
        Header: 'Wiederbelebung',
        accessor: 'revives'
    },
    {
        Header: 'Eroberungen',
        accessor: 'captures'
    },
    {
        Header: 'Fahrzeug (Leicht)',
        accessor: 'lightVehicle'
    },
    {
        Header: 'Fahrzeug (Schwer)',
        accessor: 'heavyVehicle'
    },
    {
        Header: 'Fahrzeug (Luft)',
        accessor: 'airVehicle'
    },
    {
        Header: 'Passagier Flugdistanz',
        accessor: 'traveled'
    },
    {
        Header: 'Pilot Flugdistanz',
        accessor: 'carried'
    },
    {
        Header: 'Bewusstlosigkeit',
        accessor: 'passOuts'
    },
    {
        Header: 'Geld ausgegeben',
        accessor: 'moneySpent'
    },
    {
        Header: 'Tode',
        accessor: 'died'
    },
]

const metadata = /(?:(?<date>\d{4}\/\d{2}\/\d{2}), )?(?<time>\d{2}:\d{2}:\d{2}) "\[OPT] \((?<type>Mission|Budget|Punkte|Fahne|Transport|Fraktionsübersicht|Abschuss|REVIVE)\) (?:Log: (?<gametime>\d{1,2}:\d{2}:\d{2})? ---)?/;

function getColorForSide(side, alpha = 1) {
    switch (side?.toLowerCase()) {
        case 'csat':
            return `rgba(255, 0, 0, ${alpha})`;
        case 'nato':
            return `rgba(0, 0, 255, ${alpha})`;
        case 'aaf':
        case 'guer':
            return `rgba(0, 255, 0, ${alpha})`;
        case 'arf':
            return `rgb(9, 90, 172, ${alpha})`;
        case 'sword':
            return `rgb(255, 95, 0, ${alpha})`;
        default:
            console.error("unable to find color for side", side)
            return `rgba(0, 0, 0, ${alpha})`;

    }


}

function getPlayedSide(rawSide) {
    switch (rawSide) {
        case 'csat':
            return `sword`;
        case 'aaf':
        case 'guer':
            return `arf`;
        default:
            throw new Error(`unable to find playedSide for rawSide ${rawSide}`);
    }
}

function appendPlayerData(player, dataKey, dataValue) {
    if (player) {
        if (!playerStats[player]?.name) {
            const PRISTINE_STAT = {
                name: player,
                kills: 0,
                friendlyFires: 0,
                revives: 0,
                captures: 0,
                lightVehicle: 0,
                heavyVehicle: 0,
                airVehicle: 0,
                traveled: 0,
                carried: 0,
                passOuts: 0,
                moneySpent: 0,
                died: 0,
            }

            playerStats[player] = {
                ...PRISTINE_STAT,
                ...{[dataKey]: dataValue}
            }
        } else {
            playerStats[player][dataKey] += dataValue
        }
    }
}

function appendLineData(sourceDatasets, rawSide, data, dataSettings = {}) {
    const side = getPlayedSide(rawSide.toLowerCase());
    if (side) {
        const matchingDataset = sourceDatasets.find((dataset) => dataset.label === side);
        if (!matchingDataset) {
            sourceDatasets.push({
                type: 'line',
                label: side,
                borderWidth: 1,
                pointRadius: 0,
                lineTension: 0.22,
                data: [data],
                backgroundColor: getColorForSide(side, 0.05),
                hoverBackgroundColor: getColorForSide(side, 0.55),
                borderColor: getColorForSide(side, 1),
                ...dataSettings
            });
        } else {
            matchingDataset.data.push(data);
        }
    }
}

function parseBudget(line, gameTimeAsMilliseconds) {
    // 22:33:54 "[OPT] (Budget) Log: 2:24:45 --- AAF alt: 1.495e+06 - neu: 1.445e+06 - Differenz: -50000. Verondena (ver)kaufte WY-55 Hellcat (Unarmed)"
    const budgetMatch = line.match(/--- (?<rawSide>\w+) alt: (?<oldTotal>.+) - neu: (?<newTotal>.+) - Differenz: (?<balance>-?\d+). (?<player>.+) \(ver\)kaufte/)
    const {rawSide, newTotal, balance, player} = budgetMatch?.groups || {};
    if (rawSide) {
        appendLineData(budgetDatasets, rawSide, {
            t: gameTimeAsMilliseconds,
            y: +newTotal,
            line
        }, {steppedLine: 'stepped'})
    }


    const parsedBalance = +balance * -1;
    if (player) {
        appendPlayerData(player, "moneySpent", parsedBalance)
    }


    // "20:00:12 "[OPT] (Budget) Log: 0:00:00 --- Startbudget: AAF:4e+06 - CSAT:4e+06""
    // TODO
    // "22:39:14 "[OPT] (Budget) Log: 2:30:05 --- Endbudget: (AAF:1.395e+06 | CSAT:14000)""
    // TODO

}

function parseRevive(line) {
    // REVIVE 22:36:52 "[OPT] (REVIVE) Log: 2:27:43 --- Joernrich (GUER) wurde von Gelir (GUER) wiederbelebt."
    const reviveMatch = line.match(/--- (?<patientPlayer>.+) \((?<patientSide>\w+)\) wurde von (?<medicPlayer>.+) \((?<medicSide>\w+)\) wiederbelebt./)
    const {medicPlayer} = reviveMatch?.groups || {};
    if (medicPlayer) {
        appendPlayerData(medicPlayer, "revives", 1)
    }
}

function parseFlag(line, gameTimeAsMilliseconds) {
    const dominationMatch = line.match(/(?<flagSide>\w+) Flagge (?<action>gesichert|erobert) von (?<player>.*)"/)
    const {player, flagSide, action} = dominationMatch?.groups || {};
    if (player) {
        appendPlayerData(player, "captures", 1)
        appendLineData(dominationDatasets, flagSide, {t: gameTimeAsMilliseconds, y: action === "erobert" ? 1 : -1, line}, {
            type: 'bar',
            barPercentage: 1,
            categoryPercentage: 1,
            barThickness: 'flex',
        })
    }

    const scoreMatches = [...line.matchAll(/(?<rawSide>\w+) (?<score>\d+)/g)];
    scoreMatches.forEach((match) => {
        const {rawSide, score} = match?.groups || {};
        if (rawSide) {
            appendLineData(scoreDatasets, rawSide, {t: gameTimeAsMilliseconds, y: +score, line})
        }
    })
}

function parseKill(line, gameTimeAsMilliseconds) {
    // 21:09:20 "[OPT] (Abschuss) Log: 1:00:11 --- Einheit: Pelle (side: GUER) von: Frozen_byte (side: EAST) (magazine: 5.8 mm 30Rnd Mag)"
    // 22:38:24 "[OPT] (Abschuss) Log: 2:29:15 --- Einheit: [THE](Cpt.)schmiet (side: EAST) von: Dominik (side: EAST) (magazine: 5.8 mm 30Rnd Mag)"
    const playerKillMatch = line.match(/--- Einheit: (?<victimPlayer>.+) \(side: (?<victimSide>\w+)\) von: (?<slayerPlayer>.+) \(side: (?<slayerSide>\w+)\) \((?<crimeWeapon>.+)\)/)
    // 21:11:35 "[OPT] (Abschuss) Log: 1:02:26 --- Fahrzeug: Strider (category: Leicht) (side: OPT_AAF) von: Wiesl (side: EAST) (vehicle: BTR-K Kamysh), Murda]X[ (side: EAST) (vehicle: BTR-K Kamysh), [GNC]Lord-MDB (side: EAST) (vehicle: BTR-K Kamysh)"
    // TODO vehicle Syntax?!

    //"22:39:08 "[OPT] (Abschuss) Log: 2:29:59 --- Einheit: Error: No unit (side: CIV) von: Scott (side: GUER) (magazine: RGO Grenade)""

    const {victimPlayer, slayerPlayer, victimSide, slayerSide} = playerKillMatch?.groups || {};

    if (!victimPlayer || !slayerPlayer) {
        console.error("unable to parse", {line, victimPlayer, slayerPlayer});
    } else if (victimSide === slayerSide) {
        appendPlayerData(slayerPlayer, "friendlyFires", 1)
    } else {
        appendPlayerData(victimPlayer, "passOuts", 1)
        appendPlayerData(slayerPlayer, "kills", 1)
    }


}

function parseLog(log) {
    log.split("\n")
        .filter((line) => line.includes('"[OPT] ('))
        .forEach((line) => {
            const {type, gametime} = line.match(metadata)?.groups || {};
            const gameTimeAsMilliseconds = duration(gametime, 'HH:mm:ss').asMilliseconds();
            switch (type?.toLowerCase()) {
                case "revive":
                    parseRevive(line);
                    break;
                case "mission":
                    // TODO parse mission 22:39:14 "[OPT] (Mission) Log: 2:30:05 --- Missionzeit abgelaufen" 9005000 and get max-x-axis
                    break;
                case "budget":
                    parseBudget(line, gameTimeAsMilliseconds);
                    break;
                case "punkte":
                    break;
                case "fahne":
                    parseFlag(line, gameTimeAsMilliseconds);
                    break;
                case "transport":
                    break;
                case "fraktionsübersicht":
                    break;
                case "abschuss":
                    parseKill(line, gameTimeAsMilliseconds);
                    break;
                default:
                    console.error("Problems parsing line: '", line, "' for type:", type)
                    break;
            }
        })
}

const radarLabels = playerColumns.map(c => c.accessor);

function App() {
    const [loading, setLoading] = useState(true);
    const onUploadLog = (event) => {
        setLoading(true);
        event.target.files[0].text().then(parseLog).then(() => setLoading(false));
    }
    useEffect(() => {
        parseLog(DEMOLOG)
        setLoading(false)
    })


    return (
        <div className="App">
            <input type="file" onChange={onUploadLog}/>
            {!loading && <>
                <PlayerTable/>
                <Line data={{datasets: dominationDatasets}} options={{
                    tooltips: LINE_TOOLTIP,
                    scales: {
                        xAxes: [GAMETIME_SCALE]
                    }
                }}/>
                <Line data={{datasets: scoreDatasets}} options={{
                    tooltips: LINE_TOOLTIP,
                    scales: {
                        xAxes: [GAMETIME_SCALE]
                    }
                }}/>
                <Line data={{datasets: budgetDatasets}} options={{
                    tooltips: LINE_TOOLTIP,
                    scales: {
                        xAxes: [GAMETIME_SCALE]
                    }
                }}/>
                <Radar
                    data={{
                        labels: radarLabels,
                        datasets: Object.keys(playerStats).map((playerName) => (
                            {
                                label: playerName,
                                data: radarLabels.map((label) => playerStats[playerName][label] ?? 0)
                            }
                        ))
                    }}
                />
            </>}
        </div>
    );
}

function PlayerTable() {
    const columns = useMemo(() => playerColumns, [playerColumns]);
    const data = useMemo(() => Object.values(playerStats), [playerStats]);

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
    } = useTable(
        {
            columns,
            data,
        },
        useSortBy
    )

    return (
        <>
            <table {...getTableProps()}>
                <thead>
                {headerGroups.map(headerGroup => (
                    <tr {...headerGroup.getHeaderGroupProps()}>
                        {headerGroup.headers.map(column => (
                            // Add the sorting props to control sorting. For this example
                            // we can add them into the header props
                            <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                                {column.render('Header')}
                                {/* Add a sort direction indicator */}
                                <span>
                    {column.isSorted
                        ? column.isSortedDesc
                            ? ' 🔽'
                            : ' 🔼'
                        : ''}
                  </span>
                            </th>
                        ))}
                    </tr>
                ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                {rows.map(
                    (row, i) => {
                        prepareRow(row);
                        return (
                            <tr {...row.getRowProps()}>
                                {row.cells.map(cell => {
                                    return (
                                        <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                                    )
                                })}
                            </tr>
                        )
                    }
                )}
                </tbody>
            </table>
        </>
    )
}

export default App;
