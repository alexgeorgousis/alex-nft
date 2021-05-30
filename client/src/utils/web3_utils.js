import web3 from "../index";
import AlexStar from "../contracts/AlexStar.json";

const contractAddress = "0xdD4F5a5844Ae7C4338284007646f4e7f9FB2BCe2";

export async function fetchStars() {
    const contract = new web3.eth.Contract(AlexStar.abi, contractAddress);
    const stars = await contract.methods.getAllStars().call();

    let starsProcessed = [];
    stars && stars.forEach(star => {
        let ether = web3.utils.fromWei(star.price, "ether");
        starsProcessed.push({ id: star.id, name: star.name, price: ether });
    });

    return starsProcessed;
}

export async function createStar({ name, price, ownerAddress }) {
    const contract = new web3.eth.Contract(AlexStar.abi, contractAddress);
    const wei = web3.utils.toWei(price, "ether");
    const result = await contract.methods.mintStar(name, wei).send({ from: ownerAddress });
}

export async function buyStar({ id, value, buyerAddress }) {
    const contract = new web3.eth.Contract(AlexStar.abi, contractAddress);
    const wei = web3.utils.toWei(value, "ether")
    const result = await contract.methods.buyStar(id).send({ from: buyerAddress, value: wei });
}
