import React from 'react';
import numeral from "numeral";
import './Table.css';

function Table({ countries }) {  //getting countries as a variable
    return (
        <div className = "table">
            {countries.map(({ country, cases }) => (  //go through all the country and cases in the array
                <tr>
                    {/* To show the country name  */}
                    <td>{country}</td>  
                    {/* To show the number of cases  */}
                    <td>
                        {/* This will add comma in the numbers */}
                        <strong>{numeral(cases).format("0,0")}</strong>
                    </td>
                </tr>   
            ))}
        </div>
    );
}

export default Table;
