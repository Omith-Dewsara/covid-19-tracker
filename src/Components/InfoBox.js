import React from "react";
import { Card, CardContent, Typography } from "@material-ui/core";
import "../styles/InfoBox.css";	

function InfoBox({ title, cases, isRed, active, total, ...props}) {
	return (
		<Card 
			className={`infoBox ${active && "InfoBox--selected"} ${isRed && "InfoBox--red"}`}
			onClick={props.onClick}
		>
			<CardContent>
				<Typography 
					color="textSecondary"
					className="infoBox__title"
				>
					{ title }
				</Typography>

				<h2 className={`infoBox__cases ${!isRed && "infoBox__cases--green"}`}> { cases } </h2>
				<Typography 
					className="infoBox__total"
					color="textSecondary"
				> 
					{ total } Total 
				</Typography>
			</CardContent>
		</Card>
	)
}

export default InfoBox;