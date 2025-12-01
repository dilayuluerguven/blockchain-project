const { ethers } = require("hardhat");

async function main() {
  const Registry = await ethers.getContractFactory("CertificateRegistry");

  console.log("Deploying CertificateRegistry...");

  const reg = await Registry.deploy();

  // Yeni Hardhat/Ethers modunda deployment böyle beklenir:
  await reg.waitForDeployment();

  console.log("CertificateRegistry deployed at:", reg.target);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
