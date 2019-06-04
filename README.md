# kofo wallet
Kofo network supports blockchain wallet, which provides signature and private key and mnemonic HDWallet management.Currently supporting **`BTC/USDT`** **`ETH/ERC20`** **`ZILLIQA`** **`EOS`** **`BOS`** **`MEETONE`** chain and currency.
This wallet does not have any communication with the full nodes of each chain. It is an offline wallet and only provides the rawTransaction signature returned by the gateway of KOFO network. High safety.

## Install and import

```bash
npm install kofo-wallet --save
```
```js
const KofoWallet = require('kofo-wallet');
import KofoWallet from 'kofo-wallet';
```

## Test
```
npm run test
```

## API
### createWallet(options)
**options**:
* `chain` Chain name
* `currency`: Currency name
* `network`: For BTC chain, default is `livenet`.
* `passphrase`: Mnemonic passphrase
* `language`: Mnemonic language default 'en'
* `walletType`: For BTC chain, default is `P2PKH`, supports `P2PKH` and `P2SH`. [More info](https://en.bitcoin.it/wiki/Address)
* `path`: Mnemonic path [more info](https://github.com/bitcoin/bips/blob/master/bip-0044.mediawiki)
```js
//create eth wallet
let wallet = KofoWallet.createWallet({chain: 'ETH', currency: 'ETH'});
wallet.export()

//create btc wallet(P2PKH)
wallet = KofoWallet.createWallet({chain: 'BTC', currency: 'BTC'});
wallet.export()

//create btc wallet(P2SH)
wallet = KofoWallet.createWallet({chain: 'BTC', currency: 'BTC', walletType: 'P2SH'});
wallet.export()
```


### importMnemonicWallet(options)
**options**:
* `chain` Chain name
* `currency`: Currency name
* `mnemonic`: Mnemonic words
* `passphrase`: Mnemonic passphrase
* `language`: Mnemonic language default 'en'
* `network`: For BTC chain, default is `livenet`.
* `walletType`: For BTC chain, default is `P2PKH`, supports `P2PKH` and `P2SH`. [More info](https://en.bitcoin.it/wiki/Address)
* `path`: Mnemonic path [more info](https://github.com/bitcoin/bips/blob/master/bip-0044.mediawiki)
```js
const mnemonic = 'side evidence harbor proof soft december bind example immense give cancel oven';
//import eth mnemonic hd wallet
let wallet = KofoWallet.importMnemonicWallet({chain: 'ETH', currency: 'ETH', mnemonic: mnemonic});
wallet.export()

//import btc mnemonic hd wallet(P2PKH)
wallet = KofoWallet.importMnemonicWallet({chain: 'BTC', currency: 'BTC', mnemonic:mnemonic});
wallet.export()

//create btc mnemonic hd wallet(P2SH)
wallet = KofoWallet.importMnemonicWallet({chain: 'BTC', currency: 'BTC',mnemonic: mnemonic, walletType: 'P2SH'});
wallet.export()
```

### importPrivateKey(options)
Specify the chain, currency, private key and network key to import the corresponding chain of private key wallet, import can be the chain of the raw transaction signature.
**options**:
* `chain` Chain name
* `currency`: Currency name
* `privateKey`: Mnemonic words
* `network`: For BTC chain, default is `livenet`.
* `walletType`: For BTC chain, default is `P2PKH`, supports `P2PKH` and `P2SH`. [More info](https://en.bitcoin.it/wiki/Address)
* `path`: Mnemonic path [more info](https://github.com/bitcoin/bips/blob/master/bip-0044.mediawiki)
```js
//Import ETH private wallet
let wallet = KofoWallet.importPrivateWallet('ETH','ETH','07FED02BDB20EFE5297445472E2AD0647C9E288A5E28A4E0C7C18CEEFC09B470');

//sign eth rawTransaction
wallet.sign('rawTransaction');

//export eth wallet info
wallet.export();

//Import BTC private wallet(P2SH)
wallet = KofoWallet.importPrivateWallet('BTC', 'BTC', 'L4djGpF8XrBoNQKitkT4S398Q8NijEzcdWayGPCS4hXnMDMTfbk2', 'P2SH');
wallet.export()

//Import BTC private wallet(P2PKH)
wallet = KofoWallet.importPrivateWallet('BTC', 'BTC', 'L4djGpF8XrBoNQKitkT4S398Q8NijEzcdWayGPCS4hXnMDMTfbk2');
wallet.export()

//sign btc rawTransaction
wallet.sign(rawTransaction);
```

### importKeyStoreWallet(options)
Currently only the ETH chain is supported.
**options**:
* `chain` Chain name
* `currency`: Currency name
* `data`: keystore json.
* `password`: keystore password
```js
let wallet = KofoWallet.createWallet({chain: 'ETH', currency: 'ETH'});
let keystore = await wallet.exportKeyStore('pwd');
wallet = await KofoWallet.importKeyStoreWallet({
    chain: 'ETH',
    currency: 'ETH',
    data: keystore,
    password: 'pwd'
});
wallet.export()
```
### publicToAddress(options)
**options**:
* `chain` Chain name
* `currency`: Currency name
* `network`: For BTC chain, default is `livenet`.
* `publicKey`: Public key
* `walletType`: For BTC chain, default is `P2PKH`, supports `P2PKH` and `P2SH`. [More info](https://en.bitcoin.it/wiki/Address)
```js
//ETH public key to address
let wallet = KofoWallet.createWallet({chain: 'ETH', currency: 'ETH'});
let publicKey = wallet.export().publicKey;
KofoWallet.publicToAddress({chain: 'ETH', currency: 'ETH', publicKey: publicKey})

//BTC P2PKH
wallet = KofoWallet.createWallet({chain: 'BTC', currency: 'BTC'});
publicKey = wallet.export().publicKey;
KofoWallet.publicToAddress({chain: 'BTC', currency: 'BTC', publicKey: publicKey})

//BTC P2SH
wallet = KofoWallet.createWallet({chain: 'BTC', currency: 'BTC', walletType: 'P2SH'});
publicKey = wallet.export().publicKey;
KofoWallet.publicToAddress({chain: 'BTC', currency: 'BTC', publicKey: publicKey, walletType: 'P2SH'})
```