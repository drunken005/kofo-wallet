# kofo wallet
Kofo network supports blockchain wallet, which provides signature and private key management.Currently supporting **`BTC/USDT`** **`ETH/ERC20`** **`ZILLIQA`** **`EOS`** **`BOS`** **`MEETONE`** chain and currency.
This wallet does not have any communication with the full nodes of each chain. It is an offline wallet and only provides the rawTransaction signature returned by the gateway of KOFO network. High safety.

## Install and import

```bash
npm install kofo-wallet --save
```
```js
const KofoWallet = require('kofo-wallet');

import KofoWallet from 'kofo-wallet';
```

## API

### importPrivateKey(chain, currency, privateKey, network)
Specify the chain, currency, private key and network key to import the corresponding chain of private key wallet, import can be the chain of the raw transaction signature. Network for BTC chain, default is `livenet`.
##### Import private key of one chain
```js
let wallet = new KofoWallet('ETH','ETH','07FED02BDB20EFE5297445472E2AD0647C9E288A5E28A4E0C7C18CEEFC09B470');

//sign eth rawTransaction
wallet.ETH.sign('rawTransaction');

//export eth wallet info
wallet.ETH.export();
```

##### Import private key of multiple chains
```js
const privateKyes = {
    BTC: 'd52be60fde396447f86655476a5b082dd80c1dbda104242a677cdd8ebca2190b',
    ETH: '07FED02BDB20EFE5297445472E2AD0647C9E288A5E28A4E0C7C18CEEFC09B470',
    EOS: '5JSRAcfALhELVvTK59umFEXSzY4MkBCL3SPajSZw1BqHyoLtH79',
    ZIL: 'db11cfa086b92497c8ed5a4cc6edb3a5bfe3a640c43ffb9fc6aa0873c56f2ee3',
    MEETONE: '5KV3PL9r5vCc7WNY57z4FyPomYsCmbyJnom2NXgL1DuW7sMmuwu',
    BOS: '5Kf6mvV1tYLSnsovxcyTz3FG62KkpwZguPRniKe6YVgjb9q8bus'
};
//BTC network, enum=['livenet','testnet'] default 'livenet'
const NETWORK = 'livenet';


let wallet = new KofoWallet();

wallet.importPrivateKey('BTC', 'BTC', privateKyes.BTC, NETWORK);
wallet.importPrivateKey('ETH', 'ETH', privateKyes.ETH);
wallet.importPrivateKey('EOS', 'EOS', privateKyes.EOS);
wallet.importPrivateKey('ZIL', 'ZIL', privateKyes.ZIL);
wallet.importPrivateKey('MEETONE', 'MEETONE', privateKyes.MEETONE);
wallet.importPrivateKey('BOS', 'BOS', privateKyes.BOS);

console.log(wallet);
//outprint
/***
{
  BTC:
   Wallet {...},
  ETH:
   Wallet {...},
  EOS:
   Wallet {...},
  ZIL:
   Wallet {...},
  MEETONE:
   Wallet {...},
  BOS:
   Wallet {...}
 }
***/

//sign chain rawTransaction, one of the values of the chain ['BTC', 'ETH', 'EOS', 'ZIL', 'MEETONE', 'BOS']
wallet[chain].sign(rawTransaction);
//export chain wallet info, One of the values of the chain ['BTC', 'ETH', 'EOS', 'ZIL', 'MEETONE', 'BOS']
wallet[chian].export()
```

### publicToAddress(chain, currency, publicKey, network)
```js
const KofoWallet = require('kofo-wallet');

//ETH public key to address
KofoWallet.publicToAddress('ETH','ETH','0x047ee4370138916819d252686cdee323c5a01c2a203e00eb3b3fb588df9c79562601615e6969375f7bea207b6051940994d1e45fc221b3073ce2a5b97dc20349b9')

//BTC public key to address
KofoWallet.publicToAddress('BTC','BTC','0223d4f4413e8f48afdbf1e2d17f5ca17b50a4685f7db7e7c4b0ce6f286b160bf6','testnet')

...
```