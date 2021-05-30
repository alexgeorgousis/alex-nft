import React from "react";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { buyStar } from "../utils/web3_utils";


const Star = ({ id, name, price, account }) => {
    const onBuy = () => {
        buyStar({ id: id, value: price, buyerAddress: account });
    }

    return (
        <Card style={{ width: '200px', border: '' }}>
            <Card.Img variant="top" src="/star.png" />
            <Card.Body>
                <Card.Title><center>{name}</center></Card.Title>
                <center><Button onClick={() => onBuy()} variant="outline-success">Buy ({price} Ether)</Button></center>
            </Card.Body>
        </Card>
    );
}

export default Star;
