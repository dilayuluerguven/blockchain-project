import "dotenv/config";
import { ethers } from "ethers";
import readlineSync from "readline-sync";
import fs from "fs";

const abiJson = JSON.parse(
  fs.readFileSync("./CertificateRegistry.json", "utf8")
);

const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

const contract = new ethers.Contract(
  process.env.CONTRACT_ADDRESS,
  abiJson.abi,
  wallet
);

console.log("\n=== Certificate System CLI ===");
console.log("1) Sertifika Olustur (issueCertificate)");
console.log("2) Sertifika Doğrula (verifyCertificate)");

const choice = readlineSync.question("Secim (1 veya 2): ");

async function issueCert() {
  const student = readlineSync.question("Ogrenci adresi (0x...): ");
  const name = readlineSync.question("Ogrenci adi: ");
  const course = readlineSync.question("Kurs adi: ");
  const date = Number(readlineSync.question("Tarih (unix, 0=süresiz): "));

  console.log("\nİslem gonderiliyor, lütfen bekleyin...");

  const tx = await contract.issueCertificate(student, name, course, date);
  await tx.wait();

  console.log("\n Sertifika basariyla olusturuldu!");
}

async function verifyCert() {
  const student = readlineSync.question("Ogrenci adresi (0x...): ");

  console.log("\nBlockchain üzerinden doğrulaniyor...");

  const valid = await contract.verifyCertificate(student);

  console.log("\n=== Doğrulama Sonucu ===");
  console.log("Geçerli mi?:", valid ? "EVET ✔" : "HAYIR ✘");
}

if (choice === "1") {
  issueCert();
} else if (choice === "2") {
  verifyCert();
} else {
  console.log(" Geçersiz seçim.");
}
