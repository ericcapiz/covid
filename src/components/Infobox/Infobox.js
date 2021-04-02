import { Card, CardContent, Typography } from '@material-ui/core';
import React from 'react';

const Infobox = ({title, cases, total}) => {
    return (
        <Card className="infoBox">
            <CardContent className="cardContain">
                <Typography className="infoBox__title" color="textSecondary">{title}</Typography>
                <h2 className="infoBox__cases">{cases}</h2>
                <Typography className="infoBox__total" color="textSecondary">Total: {total}</Typography>
            </CardContent>
        </Card>
    )
}

export default Infobox;