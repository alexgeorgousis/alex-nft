import React from "react";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";


const Star = ({ id, name, price, imageSrc, account, isOwner, onBuyParent }) => {
    const onBuy = () => {
        onBuyParent({ id: id, value: price, buyerAddress: account });
    }

    return (
        <Card style={{ width: '200px', border: '' }}>
            <Card.Img variant="top" src={imageSrc === "" ? "/star.png" : imageSrc} height="180px" />
            <Card.Body>
                <Card.Title><center>{name}</center></Card.Title>

                {isOwner ?
                    <center><p style={{ color: "blue" }}>(You own this)</p></center> :
                    <center><Button onClick={() => onBuy()} variant="outline-success">Buy ({price} Ether)</Button></center>
                }

            </Card.Body>
        </Card >
    );
}

export default Star;
