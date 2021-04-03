import React from 'react';
import { Card, CardContent, Typography } from '@material-ui/core';
import './Infobox.css';

const Infobox = ({title, cases, active, isGreen, isOrange, total, isRed, ...props}) => {
    return (
        <Card onClick={props.onClick} className="infoBox">
            <CardContent className="cardCont">
                <Typography className="infoBox__title" >{title}</Typography>
                <h2 className={`infoBox__cases ${active && "infoBox__cases--selected"} ${isRed && "infoBox__cases--red" || isGreen && "infoBox__cases--green" || isOrange && "infoBox__cases--orange"} `}>{cases}</h2>
                <Typography className={`infoBox__total`} >Total: {total}</Typography>
            </CardContent>
        </Card>
    )
}

export default Infobox;


