import React, { useEffect, useState } from "react";
import web3 from "../index";
import Container from "react-bootstrap/Container";
import Star from "./Star";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { fetchStars, createStar } from "../utils/web3_utils";
import { buyStar } from "../utils/web3_utils";


const App = () => {
  const [account, setAccount] = useState("");
  const [stars, setStars] = useState([]);

  const onBuy = (starInfo) => {
    buyStar(starInfo)
      .then(() => fetchStars(account).then(result => setStars(result)));
  }
  const starComponents = stars.map(star =>
    <Star
      key={star.id}
      id={star.id} name={star.name} price={star.price} imageSrc={star.imageSrc}
      account={account} isOwner={star.isOwner} onBuyParent={onBuy} />);

  const [inputName, setInputName] = useState("");
  const [inputPrice, setInputPrice] = useState("");
  const [inputImageSrc, setInputImageSrc] = useState("");

  useEffect(() => {
    window.ethereum.on("accountsChanged", accounts => accounts && setAccount(accounts[0]));
  }, []);

  useEffect(() => {
    // Check if already connected to a provider
    web3.eth.getAccounts()
      .then((accounts) => {
        if (accounts.length > 0) setAccount(accounts[0]);
      }, console.log);

    fetchStars(account).then(result => setStars(result));
  }, [account]);

  const connectWallet = () => {
    web3.eth.requestAccounts()
      .then(accounts => setAccount(accounts[0]))
      .catch(console.log);
  }

  const onCreate = async (e) => {
    e.preventDefault();

    createStar({ name: inputName, price: inputPrice, imageSrc: inputImageSrc, ownerAddress: account })
      .then(() => fetchStars(account).then(result => setStars(result)))
      .catch(console.log);
  }



  return (
    <div>
      <Container>
        <div style={{ border: '', display: 'flex', justifyContent: "center", marginTop: "50px", marginBottom: "50px" }}>
          <h1 style={{ marginRight: "20px" }}>ASTAR Gallery</h1>
          <Button
            onClick={() => connectWallet()}
            variant={account === "" ? "outline-primary" : "outline-secondary"} style={{ marginLeft: '' }}
            disabled={!(account === "")}>
            Connect Wallet
          </Button>
        </div>

        <div style={{ border: '', display: "flex", alignContent: "center", justifyContent: "center" }}>
          {starComponents}
        </div>

        <div style={{ marginTop: "50px", display: 'flex', justifyContent: "center" }}>
          <Form inline onSubmit={(e) => onCreate(e)}>
            <Form.Control
              type="text" placeholder="Star name"
              onChange={(e) => setInputName(e.target.value)}
            />

            <Form.Control
              type="number" placeholder="Star price"
              onChange={(e) => setInputPrice(e.target.value)}
            />

            <Form.Control
              type="text" placeholder="Image link (Optional)"
              onChange={(e) => setInputImageSrc(e.target.value)}
            />

            <Button type="submit" variant="outline-primary">Create</Button>
          </Form>
        </div>
      </Container>
    </div>
  );
}

export default App;
