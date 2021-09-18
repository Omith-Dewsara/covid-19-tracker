import React, { useState, useEffect } from "react";
import './App.css';
import { FormControl, MenuItem, Select, Card, CardContent } from '@material-ui/core';
import InfoBox from "./Components/InfoBox";
import Map from "./Components/Map";
import Table from "./Components/Table";
import { sortData } from "./util";
import LineGraph from "./Components/LineGraph";
import "leaflet/dist/leaflet.css";
import { prettyPrintStat } from "./util";

function App() {
  const [countries, setCountries] = useState([
    "USA",
    "CANADA",
    "FRANCE"
  ]);

  const [country, setCountry] = useState("worldwide");
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([])
  const [mapCountries, setMapCountries] = useState([]);
  const [casesType, setCasesType] = useState('cases');

  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
    .then(response => response.json())
    .then(data => {
      setCountryInfo(data);
    })
  }, [])

  useEffect(() => {
    const getCountriesData = async () => {
      await  fetch("https://disease.sh/v3/covid-19/countries")
      .then(response => response.json())
      .then(data => {
        const countries = data.map(country => (
          {
            name: country.country,
            value: country.countryInfo.iso2
          }
        ))
        const sortedData = sortData(data);

        setMapCountries(data);
        setTableData(sortedData);
        setCountries(countries);
      })
    }

    getCountriesData();
  }, [])

  const onCountryChange = async (event) => {
    const countryCode = event.target.value

    const url = countryCode === "worldwide" ? "https://disease.sh/v3/covid-19/all" : `https://disease.sh/v3/covid-19/countries/${countryCode}`

    await fetch(url)
    .then(response => response.json())
    .then(data => {
      setCountry(countryCode)
      setCountryInfo(data);

      if (countryCode !== "worldwide") {
        setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
        setMapZoom(4);
      } else {
        setMapCenter({ lat: 34.80746, lng: -40.4796 });
        setMapZoom(2)
      }
    })
  }


  const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796 });
  const [mapZoom, setMapZoom] = useState(3);

  return (
    <div className="app">
      <div className="app__left">
        <div className="app__header">
          <h1> Covid 19 TRACKER </h1>
          <FormControl className="app__dropdown">
            <Select
              variant="outlined"
              value={country}
              onChange={onCountryChange}
            >
              <MenuItem value="worldwide"> Worldwide </MenuItem>
              {
                countries.map(country => (
                  <MenuItem value={country.value}> { country.name } </MenuItem>  
                ))
              }
            </Select>
          </FormControl>
        </div>

        <div className="app__stats">
          <InfoBox 
            onClick={e => setCasesType('cases')}
            title="Corona Virus cases"
            cases={prettyPrintStat(countryInfo.todayCases)}
            total={countryInfo.cases}
            active={casesType === "cases"}
            isRed
          />
          <InfoBox 
            onClick={e => setCasesType('recovered')}
            title="Recovered"
            cases={prettyPrintStat(countryInfo.todayRecovered)}
            total={countryInfo.recovered}
            active={casesType === "recovered"}
          />
          <InfoBox 
            onClick={e => setCasesType('deaths')}
            title="Deaths"
            cases={prettyPrintStat(countryInfo.todayDeaths)}
            total={countryInfo.deaths}
            active={casesType === "deaths"}
            isRed
          />
        </div>
        <Map 
          center={mapCenter}
          zoom={mapZoom}
          countries={mapCountries}
          casesType={casesType}
        />
      </div>

      <Card className="app__right">
        <CardContent>
          <h3> Live cases by country </h3>
          <Table countries={tableData} />
          <h3 className="app__graphTitle"> Worldwide new { casesType } </h3>
          <LineGraph 
            casesType={casesType}
          />
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
