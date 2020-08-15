import React from 'react';
import {Line} from "react-chartjs-2";
import {LINE_TOOLTIP, GAMETIME_SCALE} from "../App";

function BudgetBurndown({datasets}) {
    return (
        <Line data={{datasets}} options={{
            title: {
                display: true,
                text: 'Fraktionenbudget'
            },
            tooltips: LINE_TOOLTIP,
            scales: {
                xAxes: [GAMETIME_SCALE]
            },
            responsive: true,
            zoom: {
                pan: {
                    enabled: true,
                    mode: 'x',
                },
                zoom: {
                    enabled: true,
                    mode: 'xy'
                },
            }
        }}/>
    );
}

export default BudgetBurndown;