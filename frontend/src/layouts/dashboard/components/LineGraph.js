import React, { useState } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

function LineGraph(props) {
    const { title, yAxisTitle, data } = props;

    const options = {
        title: {
            text: title,
            align: 'left'
        },

        yAxis: {
            title: {
                text: yAxisTitle
            }
        },

        xAxis: {
            accessibility: {
                rangeDescription: 'Range: Jan 2023 to Aug 2023'
            }
        },

        legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'middle'
        },

        plotOptions: {
            series: {
                label: {
                    connectorAllowed: false
                },
                pointStart: 1
            }
        },

        series: data,

        responsive: {
            rules: [{
                condition: {
                    maxWidth: 500
                },
                chartOptions: {
                    legend: {
                        layout: 'horizontal',
                        align: 'center',
                        verticalAlign: 'bottom'
                    }
                }
            }]
        }
    }

    return (
        <HighchartsReact
            highcharts={Highcharts}
            options={options}
        />
    );
}

export default LineGraph;