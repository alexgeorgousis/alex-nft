const HDWalletProvider = require("@truffle/hdwallet-provider");
const mnemonic = "midnight sausage spice maple return indoor gravity palace affair eight maze steak";

module.exports = {
  contracts_build_directory: "./client/src/contracts",
  networks: {
    development: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*" // Match any network id
    },

    rinkeby: {
      provider: function () {
        return new HDWalletProvider(mnemonic, "https://rinkeby.infura.io/v3/aaf25bf2a6ac4515b0642df0761ac92a")
      },
      network_id: 4
    }
  },
  compilers: {
    solc: {
      version: "^0.8.0"
    }
  }
};
