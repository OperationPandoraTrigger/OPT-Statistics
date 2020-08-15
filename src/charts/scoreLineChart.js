import React from 'react';
import {Line} from "react-chartjs-2";
import {GAMETIME_SCALE, LINE_TOOLTIP} from "../App";

function ScoreLineChart({datasets}) {
    return (
        <Line data={{datasets}} options={{
            title: {
                display: true,
                text: 'Punktestand'
            },
            tooltips: LINE_TOOLTIP,
            scales: {
                xAxes: [GAMETIME_SCALE]
            }
        }}/>
    );
}

export default ScoreLineChart;