import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import numeral from "numeral";

function LineGraph({ casesType = 'cases' }) {
	const [data, setData] = useState([]);

	const buildChartData = (data, casesType) => {
  let chartData = [];
  let lastDataPoint;
  for (let date in data.cases) {
    if (lastDataPoint) {
      let newDataPoint = {
        x: date,
        y: data[casesType][date] - lastDataPoint,
      };
      chartData.push(newDataPoint);
    }
    lastDataPoint = data[casesType][date];
  }
  return chartData;
};


	useEffect(() => {
		fetch("https://disease.sh/v3/covid-19/historical/all?lastdays=120")
		.then(response => response.json())
		.then(data => {
			const chartData = buildChartData(data, casesType);
			setData(chartData)
		})
	}, [casesType])


const options = {
	plugins: {
	  legend: false,
	},
  elements: {
    point: {
      radius: 0,
    },
  },
  tooltips: {
    mode: "index",
    intersect: false,
    callbacks: {
      label: function (tooltipItem, data) {
        return numeral(tooltipItem.value).format("+0,0a");
      },
    },
  },
  scales: {
    xAxes: [
      {
        type: "time",
        time: {
          format: "MM/DD/YY",
          tooltipFormat: "ll",
        },
      },
    ],
    yAxes: [
      {
        gridLines: {
          display: false,
        },
        ticks: {
          // Include a dollar sign in the ticks
          callback: function (value, index, values) {
            return numeral(value).format("0.0a");
          },
        },
      },
    ],
  },
};


	return (
		<div className="lineGraph">
			{
				data?.length && (
					<Line
			          data={{
			            datasets: [
			              {
			                backgroundColor: "rgba(204, 16, 52, 0.5)",
			                borderColor: "#CC1034",
			                data: data,
			              },
			            ],
			          }}
			          options={options}
			        />
				)
			}
		</div>
	)
}

export default LineGraph;