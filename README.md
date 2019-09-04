# kofo wallet
Kofo network supports blockchain wallet, which provides signature and private key and mnemonic HDWallet management.Currently supporting **`BTC/USDT`** **`ETH/ERC20`** **`ZILLIQA`**  **`HPB`**  **`EOS`** **`BOS`** **`MEETONE`** **`BNB`** **`TRON`** chain and currency.
This wallet does not have any communication with the full nodes of each chain. It is an offline wallet and only provides the rawTransaction signature returned by the gateway of KOFO network. High safety.

**Note**: **TRON** wallet does not support transaction signatures

## Install and import

```bash
>$ npm i kofo-wallet --save
```
```js
const Wallet = require('kofo-wallet');
or
import Wallet from 'kofo-wallet';
```

## Include
* Html script tag
```js
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
</head>
<body>
<script src="https://pre.kofo.io/kofo/kofowallet.js"></script>
<div>
   <!--Useage
   KofoWallet.createWallet(...)
   KofoWallet is a global object
   -->
</div>
</body>
</html>
```

## Test
```
npm test
```

## API
### Wallet.supportsChain
Print the current wallet support chain

**return** String
```js
Wallet.supportsChain
//return 'kofo wallet supports chain:< BTC ETH EOS ZIL MEETONE BOS HPB BNB>'
```
### Wallet.createWallets(network, walletType)
Create all support chain wallets at once

**params**:
 * **network** *[Optional]* BTC/HPB/BNB network only, default `"livenet"`
 * **walletType** *[Optional]* BTC network only，default `"P2PKH"`,  supports `P2PKH` and `P2SH`. [More info](https://en.bitcoin.it/wiki/Address)

**returns** {MnemonicWallets}
```js
//btc wallet type 'P2PKH'
let wallets = Wallet.createWallets();
wallets.BTC.export()
wallets.ETH.export()
wallets.EOS.export()
wallets.ZIL.export()

//btc wallet type 'P2SH'
wallets = Wallet.createWallets('livenet', 'P2SH');
wallets.BTC.export()
wallets.ETH.export()
wallets.EOS.export()
wallets.ZIL.export()
```
### Wallet.createWallet(options)
Specify blockchain to create an HDWallet using mnemonic

**options**:
 * **chain**  Chain name e.g ETH
 * **currency**  Currency name e.g ETH
 * **network**  *[Optional]* BTC/HPB/BNB network only, default `"livenet"`
 * **language**  *[Optional]* Mnemonic language，default `"en"` english, supports [ENGLISH 'en', SPANISH 'es', JAPANESE 'ja', CHINESE 'zh', FRENCH 'fr', ITALIAN 'it']
 * **walletType**  *[Optional]* BTC network only，default `"P2PKH"`,  supports `P2PKH` and `P2SH`. [More info](https://en.bitcoin.it/wiki/Address)
 * **path**  *[Optional]* Mnemonic derive path, each chain has a different path and default path value. [More info](https://github.com/satoshilabs/slips/blob/master/slip-0044.md)

**returns** {MnemonicWallet}
```js
//create eth wallet
let wallet = Wallet.createWallet({chain: 'ETH', currency: 'ETH'});
wallet.export()

//create btc wallet(P2PKH)
wallet = Wallet.createWallet({chain: 'BTC', currency: 'BTC'});
wallet.export()

//create btc wallet(P2SH)
wallet = Wallet.createWallet({chain: 'BTC', currency: 'BTC', walletType: 'P2SH'});
wallet.export()
```


### Wallet.importMnemonicWallet(options)
Import mnemonic word HDWallet

**options**:
* **chain** Chain name e.g ETH
* **currency**: Currency name e.g ETH
* **mnemonic**: The mnemonic string
* **language**: *[Optional]* Mnemonic language，default `"en"` english,
* **network**: *[Optional]* BTC/HPB/BNB network only, default `"livenet"`
* **walletType**: *[Optional]* BTC network only，default `"P2PKH"`, supports `"P2PKH"` and `"P2SH"`. [More info](https://en.bitcoin.it/wiki/Address)
* **path**: *[Optional]* Mnemonic derive path. [More info](https://github.com/satoshilabs/slips/blob/master/slip-0044.md)

**returns** {MnemonicWallet}
```js
const mnemonic = 'side evidence harbor proof soft december bind example immense give cancel oven';
//import eth mnemonic hd wallet
let wallet = Wallet.importMnemonicWallet({chain: 'ETH', currency: 'ETH', mnemonic: mnemonic});
wallet.export()

//import btc mnemonic hd wallet(P2PKH)
wallet = Wallet.importMnemonicWallet({chain: 'BTC', currency: 'BTC', mnemonic:mnemonic});
wallet.export()

//create btc mnemonic hd wallet(P2SH)
wallet = Wallet.importMnemonicWallet({chain: 'BTC', currency: 'BTC',mnemonic: mnemonic, walletType: 'P2SH'});
wallet.export()
```

### Wallet.importPrivateKey(options)
Import the wallet with the private key

**options**:
* **chain** Chain name e.g ETH
* **currency**: Currency name e.g ETH
* **privateKey**: Wallet private key string
* **network**: *[Optional]* BTC/HPB/BNB network only, default is `"livenet"`.
* **walletType**: *[Optional]* BTC network only，default `"P2PKH"`, supports `"P2PKH"` and `"P2SH"`. [More info](https://en.bitcoin.it/wiki/Address)

**returns** {PrivateWallet}
```js
//Import ETH private wallet
let wallet = Wallet.importPrivateWallet({chain:'ETH', currency:'ETH', privateKey:'07FED02BDB20EFE5297445472E2AD0647C9E288A5E28A4E0C7C18CEEFC09B470'});

//sign eth rawTransaction
wallet.sign('rawTransaction');

//export eth wallet info
wallet.export();

//Import BTC private wallet(P2SH)
wallet = Wallet.importPrivateWallet({chain: 'BTC', currency: 'BTC', privateKey:'L4djGpF8XrBoNQKitkT4S398Q8NijEzcdWayGPCS4hXnMDMTfbk2', walletType:'P2SH');
wallet.export()

//Import BTC private wallet(P2PKH)
wallet = Wallet.importPrivateWallet({chain: 'BTC', currency: 'BTC', privateKey:'L4djGpF8XrBoNQKitkT4S398Q8NijEzcdWayGPCS4hXnMDMTfbk2'});
wallet.export()

//sign btc rawTransaction
wallet.sign(rawTransaction);
```

### async Wallet.importKeyStoreWallet(options)
Import the keystore encrypted file wallet, currently only ***ETH*** and ***ZIL*** and  ***HPB*** and ***BNB*** are supported

**options**:
* **chain** Chain name e.g ETH
* **currency**: Currency name e.g ETH
* **keystore**: Keystore JSON
* **password**: Keystore passphrase
* **network**: *[Optional]* HPB/BNB network only, default is `"livenet"`.

**returns** {Promise<PrivateWallet || MnemonicWallet>}
```js
let wallet = Wallet.createWallet({chain: 'ETH', currency: 'ETH'});
let keystore = await wallet.exportKeyStore('pwd');
wallet = await Wallet.importKeyStoreWallet({
    chain: 'ETH',
    currency: 'ETH',
    keystore: keystore,
    password: 'pwd'
});
wallet.export()
```
### Wallet.publicToAddress(options)
Takes public key hex-encoded string and returns the corresponding address

**options**:
* **chain** Chain name e.g ETH
* **currency**: Currency name e.g ETH
* **publicKey**: Public key string
* **network**: *[Optional]* BTC/BNB network only, default `"livenet"`
* **walletType**:  *[Optional]* BTC network only，default `"P2PKH"`, supports `"P2PKH"` and `"P2SH"`. [More info](https://en.bitcoin.it/wiki/Address)

**returns** {address}
```js
//ETH public key to address
let wallet = Wallet.createWallet({chain: 'ETH', currency: 'ETH'});
let publicKey = wallet.export().publicKey;
Wallet.publicToAddress({chain: 'ETH', currency: 'ETH', publicKey: publicKey})

//BTC P2PKH
wallet = Wallet.createWallet({chain: 'BTC', currency: 'BTC'});
publicKey = wallet.export().publicKey;
Wallet.publicToAddress({chain: 'BTC', currency: 'BTC', publicKey: publicKey})

//BTC P2SH
wallet = Wallet.createWallet({chain: 'BTC', currency: 'BTC', walletType: 'P2SH'});
publicKey = wallet.export().publicKey;
Wallet.publicToAddress({chain: 'BTC', currency: 'BTC', publicKey: publicKey, walletType: 'P2SH'})
```