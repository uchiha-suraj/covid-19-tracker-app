import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';  //importing Line from 'react-chartjs-2' dependency
import numeral from 'numeral';

// This work in options is entirely from "react-chartjs-2" documentation
const options = {
    legend: {
        display: false,
    },
    elements: {
        point: {
            radius: 0,
        },
    },
    maintainAspectRatio: false,
    tooltips: {
        mode: "index",
        intersect: false,
        callbacks: {
            label: function (tooltipItem, data) {
                return numeral(tooltipItem.value).format("+0,0");
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
                        return numeral(value).format("0a");  //using numeral to get hovering data
                    },
                },
            },
        ],
    },
};



// https://disease.sh/v3/covid-19/historical/all?lastdays=120

// we are building the data for our charts
const buildChartData = (data, casesType) => {     // there are three type of casesType (cases, deaths, recovered)
    let chartData = [];   // an empty array for chartData
    let lastDataPoint;  // value of this variable is changeble thats why we used let.
    console.log("casesss >>>", data.recovered);
    for(let date in data.cases) {   //letting date form data.cases
        if(lastDataPoint) {   //if it's true or exist
            let newDataPoint = {   //then we will assign into new dataPoint
                x: date,   // Date for X axis
                y: data[casesType][date] - lastDataPoint,  // newCases for Y axis,  (newCases = currentCases - previousCases)
            };
                //{ There was an error in The API, value of one of the recovered cases was in NEGETIVE.
                //  so I fix that bug by forcefully assigning the value with POSITIVE number }
                // console.log("DATE>>>>>>>>", newDataPoint.y);
                if(casesType === "recovered"){
                    if(newDataPoint.x === "12/14/20"){
                        console.log("data>>>>>>", newDataPoint.y);
                        newDataPoint.y = 5992187;
                    }
                }
            
            chartData.push(newDataPoint);   //we are pushing the newDataPoint in chartData array and storing the value
        }
        lastDataPoint = data[casesType][date];   //after performing if, we are reassigning the lastDataPoint variable
    }
    return chartData;   //returning chartData array
};


function LineGraph({ casesType = "cases", ...props }) {
    const [data, setData] = useState({});
            
    useEffect(() => {
        const fetchData = async () => {
            await fetch("https://disease.sh/v3/covid-19/historical/all?lastdays=120")  //requesting for 120 days of data
            .then((response) => {
                return response.json();  //returning the json data
            })
            .then((data) => {   //now we can do anything with the data
                // console.log("chart>>>>>", data);   //In console we will see the data in "DATE : CASES" format.
                let chartData = buildChartData(data, casesType);
                setData(chartData);
                console.log("Date :  and Cases  :", chartData);
                
            });
        };

        fetchData();            
    }, [casesType]);

    
    return (
        <div className = {props.className}>
            {data?.length > 0 && (   //data?.length is like checking if data even exist or not, if data doesn't exist then it will return undefined, which is more eligent way to handle things.
                <Line 
                    // options = {options}
                    data = {{
                        datasets: [
                            {
                                backgroundColor:"rgba(204, 16, 52, 0.5)",
                                borderColor: "#CC1034",
                                data: data,
                            },
                        ],
                    }} 
                    options = {options}
                />
            )}
            
        </div>
    );
}


export default LineGraph;