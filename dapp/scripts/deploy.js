const hre = require("hardhat");

async function main() {
  console.log("Deploying CertificateRegistry...");

  const [deployer] = await hre.ethers.getSigners();

  console.log("Using deployer:", await deployer.getAddress());
  console.log("Balance:", (await hre.ethers.provider.getBalance(deployer.getAddress())).toString());

  const Registry = await hre.ethers.getContractFactory("CertificateRegistry");
  const reg = await Registry.deploy();

  await reg.waitForDeployment();

  console.log("Contract deployed at:", await reg.getAddress());
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
