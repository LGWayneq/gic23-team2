import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

export default function PieChart(props) {
    const { title, labelName, data } = props;

    const options = {
        chart: {
          plotBackgroundColor: null,
          plotBorderWidth: null,
          plotShadow: false,
          type: 'pie'
        },
        title: {
          text: title,
          align: 'left'
        },
        tooltip: {
          pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        },
        accessibility: {
          point: {
            valueSuffix: '%'
          }
        },
        plotOptions: {
          pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: {
              enabled: true,
              format: '<b>{point.name}</b>: {point.percentage:.1f} %'
            }
          }
        },
        series: [{
          name: labelName,
          colorByPoint: true,
          data: data
        }]
      };

    return (
        <HighchartsReact
            highcharts={Highcharts}
            options={options}
        />
    )
}