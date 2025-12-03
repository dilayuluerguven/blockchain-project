const { ethers } = require("hardhat");

async function main() {
  const Registry = await ethers.getContractFactory("CertificateRegistry");
  const reg = await Registry.deploy();
  await reg.waitForDeployment();

  console.log("Contract deployed at:", await reg.getAddress());
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
