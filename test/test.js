const KofoWallet = require('../lib/index');
const privateKyes = {
    BTC: 'd52be60fde396447f86655476a5b082dd80c1dbda104242a677cdd8ebca2190b',
    ETH: '07FED02BDB20EFE5297445472E2AD0647C9E288A5E28A4E0C7C18CEEFC09B470',
    EOS: '5JSRAcfALhELVvTK59umFEXSzY4MkBCL3SPajSZw1BqHyoLtH79',
    ZIL: 'db11cfa086b92497c8ed5a4cc6edb3a5bfe3a640c43ffb9fc6aa0873c56f2ee3',
    MEETONE: '5KV3PL9r5vCc7WNY57z4FyPomYsCmbyJnom2NXgL1DuW7sMmuwu',
    BOS: '5Kf6mvV1tYLSnsovxcyTz3FG62KkpwZguPRniKe6YVgjb9q8bus'
};

let runTest = async () => {
    let kofoWallet = new KofoWallet();
    kofoWallet.importPrivateKey('BTC', 'BTC', privateKyes.BTC, 'testnet');
    kofoWallet.importPrivateKey('ETH', 'ETH', privateKyes.ETH);
    kofoWallet.importPrivateKey('EOS', 'EOS', privateKyes.EOS);
    kofoWallet.importPrivateKey('ZIL', 'ZIL', privateKyes.ZIL);
    kofoWallet.importPrivateKey('MEETONE', 'MEETONE', privateKyes.MEETONE);
    kofoWallet.importPrivateKey('BOS', 'BOS', privateKyes.BOS);


    //BTC sign rawTransaction
    let btcRawTransaction = [
        "0d731f21f86772532d348e2859076e5e2bd6fd9ea0d39bdca71695d809a7e8e3",
        "85c97bd4a3dd637a311cd8aadf688c4a772bece3a5c9e5f0ce28f10f0a7a1baf"
    ];
    let signedBtcTx = await kofoWallet.BTC.sign(btcRawTransaction);
    console.log('\nBTC signed transaction:');
    console.log(signedBtcTx);

    //ETH sign rawTransaction
    let ethRawTx = '0xf89082013c84773594008304baf094b90167de8ce070d2fb9ed981648e227257a3ff5388016345785d8a0000b864a80de0e8000000000000000000000000c0f605f2e4ca4fbe3188565e3b6a8504ee76e58001035cfe42867f3041be08a17d372da40fe718cb9b2a44bfded99e0c31481459000000000000000000000000000000000000000000000000000000000043b269';
    let signedEthTx = await kofoWallet.ETH.sign(ethRawTx);
    console.log('\nETH signed transaction:');
    console.log(signedEthTx);

    //EOS sign rawTransaction
    let eosRawTransaction = [
        "fb29d54116e926a20e23750fc220c93dcbf528774bb5d39188ae0be3750d1492"
    ];
    let signedEosTx = await kofoWallet.EOS.sign(eosRawTransaction);
    console.log('\nEOS signed transaction:');
    console.log(signedEosTx);

    //BOS sign rawTransaction
    let bosRawTransaction = [
        "fb29d54116e926a20e23750fc220c93dcbf528774bb5d39188ae0be3750d1492"
    ];
    let signedBosTx = await kofoWallet.BOS.sign(bosRawTransaction);
    console.log('\nBOS signed transaction:');
    console.log(signedBosTx);

    //MEETONE sign rawTransaction
    let meetoneRawTransaction = [
        "fb29d54116e926a20e23750fc220c93dcbf528774bb5d39188ae0be3750d1492"
    ];
    let signedMeetoneTx = await kofoWallet.MEETONE.sign(meetoneRawTransaction);
    console.log('\nMEETONE signed transaction:');
    console.log(signedMeetoneTx);


    let zilRawTransaction = {
        "amount": "0",
        "code": "",
        "data": "{\"_tag\":\"changeAdminAddress\",\"params\":[{\"type\":\"ByStr20\",\"value\":\"0x7b5f2006dcd9ec22a9f8b7d7c6e34338331b6a86\",\"vname\":\"adminAddress\"}]}",
        "gasLimit": "2000",
        "gasPrice": "1000000000",
        "nonce": "321",
        "senderPubKey": "03d8e6450e260f80983bcd4fadb6cbc132ae7feb552dda45f94b48c80b86c6c3be",
        "toAddr": "6f18B3a0fc9f232eA9Ef951b5e741895e24B15f5",
        "version": "21823496"
    };
    let signedZilTx = await kofoWallet.ZIL.sign(JSON.stringify(zilRawTransaction));
    console.log('\nZIL signed transaction:');
    console.log(signedZilTx);
    console.log('\n');

    console.log('kofo wallet providers: ', kofoWallet);
};

runTest().catch(console.log);