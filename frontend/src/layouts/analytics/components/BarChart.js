// @mui material components
import React, { useState } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

function BarChart() {
    const options = {
        chart: {
            type: 'bar'
        },
        title: {
            text: ""
        },
        subtitle: {
            text: '',
            align: 'left'
        },
        xAxis: {
            categories: ['Gohen', 'Catalysm', 'Trustmind', 'Virtous', 'Magnum'],
            title: {
                text: null
            },
            gridLineWidth: 1,
            lineWidth: 0
        },
        yAxis: {
            min: 0,
            title: {
                text: 'Total Market Value',
                align: 'high'
            },
            labels: {
                overflow: 'justify'
            },
            gridLineWidth: 0
        },
        tooltip: {
            valueSuffix: ' millions'
        },
        plotOptions: {
            bar: {
                borderRadius: '50%',
                dataLabels: {
                    enabled: true
                },
                groupPadding: 0.1
            }
        },

        credits: {
            enabled: false
        },
        series: [{
            name: 'January',
            data: [631, 727, 3202, 721, 26]
        }, {
            name: 'February',
            data: [814, 841, 3714, 726, 31]
        }, {
            name: 'March',
            data: [1044, 944, 4170, 735, 40]
        },]
    };

    return (
        <div>
            <HighchartsReact
                highcharts={Highcharts}
                options={options}
            />
        </div>
    );
}

export default BarChart;