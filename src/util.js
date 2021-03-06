import React from "react";
import numeral from "numeral";
import { Circle, Popup } from "react-leaflet";

export const sortData = (data) => {
	const sortedData = [...data];

	sortedData.sort((a, b) => {
		if (a.cases > b.cases) {
			return -1
		} else {
			return 1
		}
	})

	return sortedData;
}

const casesTypeColors = {
  cases: {
    hex: "#CC1034",
    multiplier: 200,
  },
  recovered: {
    hex: "#7dd71d",
    multiplier: 200,
  },
  deaths: {
    hex: "#fb4443",
    multiplier: 500,
  },
};

export const showDataOnMap = (data, casesType='cases') => (
	data.map(country => (
		<Circle
			center={[country.countryInfo.lat, country.countryInfo.long]}
			fillOpacity={0.4}
			color={casesTypeColors[casesType].hex}
			fillColor={casesTypeColors[casesType].hex}
			radius={
				Math.sqrt(country[casesType]) * casesTypeColors[casesType].multiplier
			}
		>
			<Popup>
				<div className="info-container">	
					<div 
						style={{ backgroundImage: `url(${country.countryInfo.flag})` }}
						className="info-flag"
					/>
					<div className="info-name"> { country.country } </div>
					<div className="info-cases"> Cases: { numeral(country.cases).format("0,0a") } </div>
					<div className="info-recovered"> Recovered: {numeral(country.recovered).format("0,0a")} </div>
					<div className="info-deaths"> Deaths: { numeral(country.deaths).format("0,0a") } </div>
				</div>
			</Popup>
		</Circle>
	))
)

export const prettyPrintStat = (stat) => (
	stat ? `+${numeral(stat).format("0.0a")}` : "+0"
)