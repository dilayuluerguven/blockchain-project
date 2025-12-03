1. Kurulum Adımları

Bu proje dizin yapısı:
```
blockchain_project/
 ├── dapp/          (Hardhat – Contract + Deploy + Test)
 ├── client/        (CLI İstemci)
 └── docker-compose.yml
```
Her şey proje klasörü içinde hazırdır, yalnızca Docker ile çalıştırmanız yeterlidir.

1.1. Docker Servislerini Başlatın

Proje klasörü içinde şu komutu çalıştırın:
```
docker compose up -d --build
```

Tamamlandığında üç konteyner aktif olacaktır:

blockchain_project-ganache-1

blockchain_project-hardhat-1

blockchain_project-client-1

Kontrol:
```
docker ps
```

 2. Akıllı Kontratın Derlenmesi ve Deploy Edilmesi
2.1. Hardhat konteynerine girin
```
docker exec -it blockchain_project-hardhat-1 sh
```

2.2. Kontratları derleyin
```
npx hardhat compile
```

2.3. Kontratı Ganache ağına dağıtın
```
npx hardhat run scripts/deploy.js --network ganache
```


Sonuç şu şekilde görünür:
```

Contract deployed at: 0x12F725E636931E48eF028d782CE191c5798DCbEE
```


Bu adresi client uygulamasına ekleyin:

client/index.js içinde:
```
const CONTRACT_ADDRESS = "0x12F725E636931E48eF028d782CE191c5798DCbEE";
```

3. Client (CLI) Uygulamasını Çalıştırma

Client otomatik olarak Docker içinde başlar.
Eğer manuel başlatmak istiyorsanız:
```

docker exec -it blockchain_project-client-1 sh
node index.js
```

Menü:
```
Certificate Registry CLI
1) Sertifika Oluştur (issue)
2) Sertifika Doğrula (verify)
3) Sertifika İptal Et (revoke)
```
 4. Testleri Çalıştırma

Testler Hardhat içinde yer alır.

Konteynere girin:
```
docker exec -it blockchain_project-hardhat-1 sh
```

Test çalıştırın:
```
npx hardhat test
```

Örnek çıktı:
```
  CertificateRegistry
    ✔ should deploy with correct owner
    ✔ should issue a certificate
    ✔ should revoke a certificate
    ✔ should verify correctly
```
 5. Ganache Private Key Alma

Sistem owner işlemlerini yapabilmek için Ganache tarafından oluşturulan private key’i kullanır.

Tüm hesap ve private key’leri görüntülemek için:
```
docker logs blockchain_project-ganache-1
```

Örnek:
```
Available Accounts:
(0) 0x38fCfBE2E309c26395f32c02...

Private Keys:
(0) 0x4a338fa9fe657593689f23...
```

Private key sadece yerel geliştirme içindir, gerçek ağlarla ilgisi yoktur.

Client içinde aşağıdaki şekilde kullanılır:
```
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
```
6.  Klasörler
   ```

dapp/
 ├── contracts/CertificateRegistry.sol
 ├── scripts/deploy.js
 └── test/certificate.test.js

client/
 ├── index.js
 └── .env
```
## 🎬 Demo Videosu

[Demo Videosunu İzle](./demo/Blockchain_Demo.mp4)
