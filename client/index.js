import 'dotenv/config';
import { ethers, keccak256, toUtf8Bytes } from "ethers";
import readlineSync from "readline-sync";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

const abiJson = JSON.parse(fs.readFileSync("./CertificateRegistry.json", "utf8"));

const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

const contract = new ethers.Contract(
  process.env.CONTRACT_ADDRESS,
  abiJson.abi,
  wallet
);

const CERT_DIR = "./certificates";
if (!fs.existsSync(CERT_DIR)) fs.mkdirSync(CERT_DIR);

function generateHolderHash(studentId, fullName, salt) {
  const normalized = `${studentId}|${fullName.toUpperCase().trim()}|${salt}`;
  return keccak256(toUtf8Bytes(normalized));
}

function uuidToBytes32(uuid) {
  return keccak256(toUtf8Bytes(uuid)); 
}


console.log(`\n Certificate Registry CLI
1) Sertifika Olustur (issue)
2) Sertifika Doğrula (verify)
3) Sertifika İptal Et (revoke)\n`);

const choice = readlineSync.question("Secim (1/2/3): ");

async function issueCert() {
  console.log("\n Sertifika Olustur ");

  const studentId = readlineSync.question("Ogrenci No: ");
  const fullName = readlineSync.question("Ad Soyad: ");
  const title = readlineSync.question("Sertifika Adi: ");
  const issuer = readlineSync.question("Kurum: ");
  const expiresAt = Number(readlineSync.question("Bitis Tarihi (unix, 0=suresiz): "));

  const id = uuidv4();
  const idBytes32 = uuidToBytes32(id);
  const salt = uuidv4();
  const holderHash = generateHolderHash(studentId, fullName, salt);

  console.log("\n İslem gönderiliyor...");
  const tx = await contract.issue(idBytes32, holderHash, title, issuer, expiresAt);
  await tx.wait();
  console.log("\nSertifika zincire yazildi!");

  const certData = {
    id,
    idBytes32,
    studentId,
    fullName,
    title,
    issuer,
    expiresAt,
    salt,
    holderHash
  };

  const filePath = path.join(CERT_DIR, `${id}.json`);
  fs.writeFileSync(filePath, JSON.stringify(certData, null, 2));

  console.log(` Sertifika kaydedildi: ${filePath}`);
}

async function verifyCert() {
  console.log("\nSertifika Doğrula ");

  const id = readlineSync.question("Sertifika ID (UUID): ");
  const certFile = `./certificates/${id}.json`;

  if (!fs.existsSync(certFile)) {
    console.log(" Sertifika dosyasi bulunamadi.");
    return;
  }

  const certData = JSON.parse(fs.readFileSync(certFile));
  const { idBytes32, holderHash } = certData;

  const result = await contract.verify(idBytes32, holderHash);

  console.log("\n Doğrulama Sonucu ");
  console.log("Gecerli mi?        :", result[0]);
  console.log("İptal edilmis mi?  :", result[1]);
  console.log("Olusturulma        :", result[2].toString());
  console.log("Son gecerlilik     :", result[3].toString());
  console.log("Baslik             :", result[4]);
  console.log("Kurum              :", result[5]);
}

async function revokeCert() {
  console.log("\n Sertifika İptal Et ");

  const id = readlineSync.question("Sertifika ID (UUID): ");
  const certFile = `./certificates/${id}.json`;

  if (!fs.existsSync(certFile)) {
    console.log(" Sertifika dosyasi bulunamadi.");
    return;
  }

  const certData = JSON.parse(fs.readFileSync(certFile));
  const idBytes32 = certData.idBytes32;

  console.log("İptal islemi gönderiliyor...");
  const tx = await contract.revoke(idBytes32);
  await tx.wait();

  console.log(" Sertifika iptal edildi!");
}

if (choice === "1") issueCert();
else if (choice === "2") verifyCert();
else if (choice === "3") revokeCert();
else console.log("Gecersiz secim.");
