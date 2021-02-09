import React from 'react'; 
import { Card, CardContent, Typography } from '@material-ui/core';  //importing metarial UI
import './Infobox.css';

function Infobox({ title, cases, isRed, active, total, ...props }) {
    return (
        // onClick = {props.onClick} ; will make our card clickable
        // className = {`infobox ${active && "infobox--selected"}`}  ==> if infobox active then modify the data in infobox--selected.
        // ${isRed && "infobox--red"} ==> if it isRed, add infobox--red.
        <Card 
            onClick = {props.onClick} 
            className = {`infobox ${active && "infobox--selected"} 
            ${isRed && "infobox--red"}
            `}>   
            <CardContent>
                {/* Title i.e. Coronavirus cases */}
                <Typography className = "infobox_title" color = "textSecondary">
                    {title}
                </Typography>
                
                {/* Number of cases  */}
                <h2 className = {`infobox_cases ${!isRed && "infobox__cases--green"}`}>
                    {cases}
                </h2>

                {/* Total  cases */}
                <Typography className = "infobox_total" color = "textSecondary">
                    {total} Total
                </Typography>
            </CardContent>
        </Card>        
    )
}

export default Infobox;
