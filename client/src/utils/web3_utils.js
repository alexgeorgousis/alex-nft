import web3 from "../index";
import AlexStar from "../contracts/AlexStar.json";

const contractAddress = "0xF6C113E7F7366ac09aB6862EDd8A8eCf3ECdCA6d";

export async function fetchStars(activeAccount) {
    const contract = new web3.eth.Contract(AlexStar.abi, contractAddress);
    const stars = await contract.methods.getAllStars().call();

    let starsProcessed = [];
    for (let i = 0; i < stars.length; i++) {
        let star = stars[i];
        let priceEther = web3.utils.fromWei(star.price, "ether");

        // Check if active account is the owner of this star
        const starOwner = await contract.methods.ownerOf(star.id).call();
        const isOwner = starOwner === activeAccount;

        starsProcessed.push({ id: star.id, name: star.name, price: priceEther, imageSrc: star.imageSrc, isOwner: isOwner });
    }

    return starsProcessed;
}

export async function createStar({ name, price, imageSrc, ownerAddress }) {
    const contract = new web3.eth.Contract(AlexStar.abi, contractAddress);
    const wei = web3.utils.toWei(price, "ether");
    await contract.methods.mintStar(name, wei, imageSrc).send({ from: ownerAddress });
}

export async function buyStar({ id, value, buyerAddress }) {
    const contract = new web3.eth.Contract(AlexStar.abi, contractAddress);
    const wei = web3.utils.toWei(value, "ether")
    const result = await contract.methods.buyStar(id).send({ from: buyerAddress, value: wei });
}
