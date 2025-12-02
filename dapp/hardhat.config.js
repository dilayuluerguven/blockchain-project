require("@nomicfoundation/hardhat-ethers");

module.exports = {
  solidity: "0.8.20",
  networks: {
    ganache: {
      url: "http://172.23.0.2:8545",
      accounts: [
        // Ganache account #0 private key — ETH dolu olan
        "0x6910fa30e0e81b14b59ce1f9f480abd8a654314fcbd9d55f735153ecfce59924"
      ]
    }
  }
};
