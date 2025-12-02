const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("CertificateRegistry", function () {
  let Registry;
  let registry;
  let owner;
  let other;

  beforeEach(async function () {
    [owner, other] = await ethers.getSigners();

    Registry = await ethers.getContractFactory("CertificateRegistry");
    registry = await Registry.deploy();
  });

  it("should deploy with correct owner", async function () {
    expect(await registry.owner()).to.equal(owner.address);
  });

  it("should issue a certificate", async function () {
    const id = ethers.keccak256(ethers.toUtf8Bytes("test-id"));
    const holderHash = ethers.keccak256(ethers.toUtf8Bytes("holder"));

    await registry.issue(id, holderHash, "Title", "Issuer", 0);

    const cert = await registry.certificates(id);
    expect(cert.issuedAt).to.not.equal(0);
    expect(cert.title).to.equal("Title");
  });

  it("should revoke a certificate", async function () {
    const id = ethers.keccak256(ethers.toUtf8Bytes("test2"));
    const holderHash = ethers.keccak256(ethers.toUtf8Bytes("holder2"));

    await registry.issue(id, holderHash, "T", "I", 0);
    await registry.revoke(id);

    const cert = await registry.certificates(id);
    expect(cert.revoked).to.equal(true);
  });

  it("should verify correctly", async function () {
    const id = ethers.keccak256(ethers.toUtf8Bytes("abc"));
    const holderHash = ethers.keccak256(ethers.toUtf8Bytes("xyz"));

    await registry.issue(id, holderHash, "ABC", "ISS", 0);

    const result = await registry.verify(id, holderHash);

    expect(result[0]).to.equal(true);   
    expect(result[1]).to.equal(false);  
  });
});