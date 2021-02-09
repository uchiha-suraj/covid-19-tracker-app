import React, {useEffect, useState} from 'react';
import './App.css';
import { 
  FormControl, 
  MenuItem, 
  Select, 
  Card, 
  CardContent
} from '@material-ui/core';  //importing metarial UI
import Infobox from './Infobox';
import Map from './Map';
import Table from './Table';
import { sortData, prettyPrintStat } from "./util";
import numeral from "numeral";
import LineGraph from './LineGraph';
import "leaflet/dist/leaflet.css";  //importing leaflet.css file from Leaflet dependency from node_modules.

function App() {

  /* STATE = How to write variable in React */
  // Declare a new state variable, which we'll call "countries"
  /* useState is a Hook (function) that allows you to have state variables in functional components. 
  You pass the initial state to this function and it returns a variable with the current state value 
  (not necessarily the initial state) and another function to update this value. */
  
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState("worldwide");  //default value is worldwide
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);  //taking an array type useState.
  const [mapCountries, setMapcountries] = useState([]);
  const [casesType, setCasesType] = useState("cases");  //default value is cases
  const [mapCenter, setMapCenter] = useState({ lat: 51.5074, lng: 0.1278 }); // Latitude and Longitude for map position, this is London.
  const [mapZoom, setMapZoom] = useState(1.5);  //zoom, and 3 is the value , by which we can see the entire map closely

  // API call for country name "https://disease.sh/v3/covid-19/countries"

  // useEffect() Runs a piece of code based on a given condition

  // Worldwide data should be seen by default in our app
  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")  //request sent to the link for worldwide data
      .then((response) => response.json())  //taking response in content type JSON
      .then((data) => {  //doing something with the data
        setCountryInfo(data);  //we are setting setCountryInfo into all the data we received
      });
  }, []);

  useEffect(() => {
    // The code inside here will run once when the component loads not again
    // Any time the variable changes inside [] <= here, it will re-run the code inside useEffect.
  
    // async => send a request, wait for it, do something with it.
    const getCountriesData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries") //request sent to the link
        .then((response) => response.json())  //taking response in content type JSON
        .then((data) => { //doing something with the data
          const countries = data.map((country) => ({   //we are mapping through every country
            name: country.country,  //United States, United Kingdom (we can check in console)
            value: country.countryInfo.iso2,  //ex = UK, USA, FR... iso2 is the country code (we can check in console)
          }));

          console.log(data);
          let sortedData = sortData(data);  //using sortData function (from util.js) to pass the data for sorting
          setCountries(countries);  //the way we gonna change the countries variable
          setMapcountries(data);  //get the all countries data
          setTableData(sortedData);  //will set the sorted data in table
        });
    };
    
    getCountriesData(); //calling the function
  
  }, []);

  console.log(casesType);

  const onCountryChange = async (event) => {  //using  async() function for data fetching
    const countryCode = event.target.value;
    // setCountry(countryCode);  //will change the dropdown name into country name
  
    //if the countryCode is worldwide then we will get all the data
    // or else we will get only country data.
    const url = countryCode === "worldwide"
      ? "https://disease.sh/v3/covid-19/all"
      : `https://disease.sh/v3/covid-19/countries/${countryCode}`; //we are using tilde ( ` ) to assign a variable.

    await fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setCountry(countryCode); //setting the country name in dropdown
        setCountryInfo(data); //all the data from the country response
        //checking the countryCode is worldwide or not
        if (countryCode === "worldwide") {
          setMapCenter([51.5074, 0.1278]);
          setMapZoom(1.5);
        } else {
          console.log("Lat:", data.countryInfo.lat);
          console.log("Lng:", data.countryInfo.long);
          setMapCenter([20.5937, 78.9629]);  //this will make current country in map center 
          setMapZoom(4);  //zoom in to selected country
        }
      });
  };
  
  // In some cases some API does not response any data, so it's a good
  // practise to console.log the information, and check the response data
  // then use the data.
  // console.log("country Info >>>>>", countryInfo);

  return (
    <div className="app">

      <div className = "app_left" >
        {/* 1--------> Header <--------- */}
      
        <div className = "app_header">
          <h1>COVID-19 TRACKER</h1>
          
          {/* Title + Select input dropdown field */}

          <FormControl className = "app-dropdown">
            {/* During onChange it will call the onCountryChange function */}
            <Select variant = "outlined" onChange = {onCountryChange} value = {country}>
                {/* It will change the dropdown name into Worldwide  */}
                <MenuItem value = "worldwide" >Worldwide</MenuItem>   

              {/* Loop through all the countries and show a dropdown list of the options */}
              {/* In react we will use JSX which allows us to combine HTML with Javascript */}
              {
                // map -> it is a function which will make us go through every item of the array named "country"
                countries.map((country) => (
                  <MenuItem value = {country.value}>{country.name}</MenuItem>
                ))
              }

            </Select>
          </FormControl>
        </div>

        {/* 2--------> Infoboxes <--------- */}
     
        <div className = "app_stats">
          {/* isRed is used for total cases and deaths */}
          {/* Infobox title = "Coronavirus cases" */}
          <Infobox 
          isRed
          active = {casesType === "cases"}
          onClick = {(e) => setCasesType("cases")}
          title = "Coronavirus Cases" 
          cases = {prettyPrintStat(countryInfo.todayCases)} 
          total = {numeral(countryInfo.cases).format("0.0a")} />

          {/* Infobox title = "Coronavirus recoveries" */}
          <Infobox 
          active = {casesType === "recovered"}
          onClick = {(e) => setCasesType("recovered")}
          title = "Recovered" 
          cases = {prettyPrintStat(countryInfo.todayRecovered)} 
          total = {numeral(countryInfo.recovered).format("0.0a")} />

          {/* Infobox title = "Coronavirus Deaths" */}
          <Infobox 
          isRed
          active = {casesType === "deaths"}
          onClick = {(e) => setCasesType("deaths")}
          title = "Deaths" 
          cases = {prettyPrintStat(countryInfo.todayDeaths)} 
          total = {numeral(countryInfo.deaths).format("0.0a")} />

        </div>

        {/* 3---------> Map <--------- */}

        <Map 
          countries={mapCountries}  //set the countries data
          casesType={casesType} //will change the color of the circle
          center={mapCenter}  //will change the map center into current country with lat and lng
          zoom={mapZoom} //zoom in to the current country
        />
        
      </div>

      
      <Card className = "app_right">
        <CardContent className = "app__information">
          
          {/* 4--------> Table <--------- */}
          <h3>Live Cases by Country</h3>
          <Table countries = {tableData} />   
          <h3>Worldwide new {casesType}</h3>

          {/* 5--------> Graph <-------- */}
          <LineGraph className = "app_graph" casesType = {casesType} />
            
        </CardContent>   
      </Card>
      
      
    </div>
  );
};

export default App;
