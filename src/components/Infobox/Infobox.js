import React from 'react';
import { Card, CardContent, Typography } from '@material-ui/core';
import './Infobox.css';

const Infobox = ({title, cases, total}) => {
    return (
        <Card className="infoBox">
            <CardContent className="cardCont">
                <Typography className="infoBox__title" >{title}</Typography>
                <h2 className="infoBox__cases">{cases}</h2>
                <Typography className="infoBox__total" >Total: {total}</Typography>
            </CardContent>
        </Card>
    )
}

export default Infobox;
