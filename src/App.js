import React, {useState,useEffect} from 'react';
import { FormControl, MenuItem, Select, Card, CardContent } from '@material-ui/core';
import Infobox from './components/Infobox/Infobox';
import Map from './components/Map/Map';
import Table from './components/Table/Table';
import {sortData} from './util';
import './App.css';

function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState('worldwide');
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);

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
            <MenuItem value="worldwide">WorldWide</MenuItem>
            {
              countries.map(country =>(
                <MenuItem key={country.name} value={country.value}>{country.name}</MenuItem>
              ))
            }
          </Select>
        </FormControl>
      </div>
      <div className="app__stats">
        <Infobox title="New Cases:" cases={countryInfo.todayCases} total={countryInfo.cases} />
        <Infobox title="Recent Recoveries:"cases={countryInfo.todayRecovered} total={countryInfo.recovered} />
        <Infobox title="New Deaths:" cases={countryInfo.todayDeaths} total={countryInfo.deaths} />
      </div>
      <Map />
      </div>
      <Card className="app__right">
        <CardContent>
          <h3>Live Cases by Country:</h3>
          <Table countries={tableData} />
          <h3>Worldwide New Cases:</h3>
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
