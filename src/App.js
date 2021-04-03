import React, {useState,useEffect} from 'react';
import { FormControl, MenuItem, Select, Card, CardContent } from '@material-ui/core';
import Infobox from './components/Infobox/Infobox';
import Map from './components/Map/Map';
import Table from './components/Table/Table';
import LineGraph from './components/LineGraph/LineGraph';
import {prettyPrintStat, sortData} from './util';
import './App.css';
import "leaflet/dist/leaflet.css";

function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState('worldwide');
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [mapCenter, setMapCenter] = useState({lat: 34.80746, lng: -40.4796});
  const [mapZoom, setMapZoom] = useState(3);
  const [mapCountries, setMapCountries] = useState([]);
  const [casesType, setCasesType] = useState('cases');

  useEffect(() => {
    fetch('https://disease.sh/v3/covid-19/all')
    .then(res => res.json())
    .then(data => {
      setCountryInfo(data)
    })
    
  }, [])

//map through api to get countries
  useEffect(() => {
    const getCountriesData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
      .then((res)=>res.json())
      .then((data) =>{
        const countries = data.map((country)=> (
          {
            name:country.country,
            //country abbr
            value:country.countryInfo.iso2
          }));
          const sortedData = sortData(data)
          setTableData(sortedData);
          setMapCountries(data);
          setCountries(countries);
      })
    }
    getCountriesData();
  }, []);

  //select country from dropdown
  const onCountryChange = async (e) => {
    const countryCode = e.target.value;
    
    //turnary to get the right url to pull data by specific country
    const url = countryCode === 'worldwide' 
    ? 'https://disease.sh/v3/covid-19/all' 
    : `https://disease.sh/v3/covid-19/countries/${countryCode}`;

    await fetch(url)
    .then(res => res.json())
    .then(data =>{
      setCountry(countryCode);
      setCountryInfo(data);
      
      //map will zoom to the country selected from dropdown
      setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
      setMapZoom(4);
    })
    }

    console.log( "info", countryInfo);

  return (
    <div className="app">
      <div className="app__left">
      <div className="app__header">
        <h1>COVID-19 Tracker</h1>
        <FormControl className="app__dropdown">
          <Select variant="outlined" value={country} onChange={onCountryChange}>
            <MenuItem value="worldwide"><p>WorldWide</p></MenuItem>
            {
              countries.map(country =>(
                <MenuItem key={country.name} value={country.value}>{country.name}</MenuItem>
              ))
            }
          </Select>
        </FormControl>
      </div>
      <div className="app__stats">
        <Infobox isOrange active={casesType === 'cases'} onClick={e => setCasesType('cases')} className="app__card" title="New Cases:" cases={prettyPrintStat(countryInfo.todayCases)} total={prettyPrintStat(countryInfo.cases)} />
        <Infobox isGreen active={casesType === 'recovered'} onClick={e => setCasesType('recovered')} className="app__card" title="Recoveries:"cases={prettyPrintStat(countryInfo.todayRecovered)} total={prettyPrintStat(countryInfo.recovered)} />
        <Infobox isRed active={casesType === 'deaths'} onClick={e => setCasesType('deaths')} className="app__card" title="New Deaths:" cases={prettyPrintStat(countryInfo.todayDeaths)} total={prettyPrintStat(countryInfo.deaths)} />
      </div>
      <Map casesType={casesType} countries={mapCountries} center={mapCenter} zoom={mapZoom} />
      </div>
      <Card className="app__right">
        <CardContent>
          <h3 >Live Cases by Country:</h3>
          <Table countries={tableData} />
          <h3>Worldwide New {casesType.charAt(0).toUpperCase() + casesType.slice(1)}:</h3>
          <LineGraph casesType={casesType} />
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
