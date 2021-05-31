# ASTAR
Simple NFT(ERC-721) based dapp. 

Using [Truffle v5.3.8](https://www.trufflesuite.com/docs/truffle/overview) and [openzeppelin ^4.1.0](https://docs.openzeppelin.com/openzeppelin/)

Token name: `Alex Star`

Token symbol: `ASTAR`

Token contract address on Rinkeby:
[0x44d273b411326a7B556976e15521d7838e019A1B](https://rinkeby.etherscan.io/token/0x44d273b411326a7B556976e15521d7838e019A1B)

## Install & Run locally
```bash
$ git clone https://github.com/alexgeorgousis/alex-nft.git

# Install solidity dependencies
$ cd alex-nft
$ npm install

# Install react dependencies
$ cd ./client
$ npm install

# Start truffle local development server (make sure you're in the top-level directory, not inside client)
$ truffle develop
> compile
> migrate

# On a separate terminal, cd into client and run:
$ npm start

# In the truffle console you can run
> test
# to run all the unit tests
```
