const hre = require("hardhat");

async function main() {
  console.log("Deploying CertificateRegistry...");

  const Registry = await hre.ethers.getContractFactory("CertificateRegistry");
  const reg = await Registry.deploy();

  console.log("Contract deployed at:", await reg.getAddress());
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
