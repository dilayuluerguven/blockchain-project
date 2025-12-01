const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying with account:", deployer.address);

  const CertificateRegistry = await ethers.getContractFactory("CertificateRegistry");
  const contract = await CertificateRegistry.deploy();

  await contract.waitForDeployment(); 
  console.log("Contract deployed to:", contract.target); 
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});
