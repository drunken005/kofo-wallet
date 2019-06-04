const KofoWallet = require('../src/index');

async function runTest() {
    const ethRawTransaction = '0xf88e0c8501dcd650008304baf094cdfe62b84e8e2c1bf0888b20fe875799a3a82f9487010dc639bbb800b864a80de0e800000000000000000000000064972593901e8c014ec5d39dfa8d879a3ba62bfdfe38c3e0af6375b3d9eb38d74931c277638cc655aa4a01e618b256950ee8643b0000000000000000000000000000000000000000000000000000000000723279';
    const ethKeystorePwd = '123456zxc';

    console.log('========================================ETH========================================');
    let wallet = KofoWallet.createWallet({chain: 'ETH', currency: 'ETH'});
    let mnemonic = wallet.export().mnemonic;
    console.log(`\nCreate ${wallet.export().chain} wallet:`);
    console.log(wallet.export());

    let signed = await wallet.sign(ethRawTransaction);
    console.log(`\n ${wallet.export().chain} wallet sign result:`);
    console.log(signed);


    let keystore = await wallet.exportKeyStore(ethKeystorePwd);
    console.log(`\nWallet.exportKeyStore MnemonicWallet ${wallet.export().chain}...............`);
    console.log(keystore);


    wallet = await KofoWallet.importKeyStoreWallet({
        chain: 'ETH',
        currency: 'ETH',
        data: keystore,
        password: ethKeystorePwd
    });
    console.log(`\nImport KeyStoreWallet MnemonicWallet  ${wallet.export().chain}............`);
    console.log(wallet.export());

    signed = await wallet.sign(ethRawTransaction);
    console.log(`\n${wallet.export().chain} wallet sign result:`);
    console.log(signed);


    wallet = KofoWallet.importPrivateWallet({chain: 'ETH', currency: 'ETH', privateKey: wallet.export().privateKey});
    console.log(`\nImport Private ${wallet.export().chain} wallet:`);
    console.log(wallet.export());

    signed = await wallet.sign(ethRawTransaction);
    console.log(`\n${wallet.export().chain} wallet sign result:`);
    console.log(signed);

    wallet = KofoWallet.importMnemonicWallet({chain: 'ETH', currency: 'ETH', mnemonic});
    console.log(`\nImport Mnemonic ${wallet.export().chain} wallet:`);
    console.log(wallet.export());

    signed = await wallet.sign(ethRawTransaction);
    console.log(`\n${wallet.export().chain} wallet sign result:`);
    console.log(signed);

    let address = KofoWallet.publicToAddress({chain: 'ETH', currency: 'ETH', publicKey: wallet.export().publicKey});
    console.log(`\n${wallet.export().chain} publicToAddress publicKey:${wallet.export().publicKey}`);
    console.log(address, address === wallet.export().address);


    console.log('========================================ETH========================================end\n\n');


    console.log('========================================BTC========================================');


    wallet = KofoWallet.createWallet({chain: 'BTC', currency: 'BTC'});
    mnemonic = wallet.export().mnemonic;
    console.log(`\n KofoWallet.createWallet BTC P2PKH....................................:`);
    console.log(wallet.export());


    wallet = KofoWallet.importMnemonicWallet({chain: 'BTC', currency: 'BTC', mnemonic, walletType: 'P2SH'});
    console.log('\nWallet.importMnemonicWallet BTC P2SH....................................:');
    console.log(wallet.export());

    console.log('\nWallet.publicKey2address BTC P2SH....................................:');
    console.log(KofoWallet.publicToAddress({
        chain: 'BTC',
        currency: 'BTC',
        publicKey: wallet.export().publicKey,
        walletType: 'P2SH'
    }));


    wallet = KofoWallet.importMnemonicWallet({chain: 'BTC', currency: 'BTC', mnemonic});
    console.log('\nWallet.importMnemonicWallet BTC P2PKH....................................:');
    console.log(wallet.export());


    wallet = KofoWallet.importPrivateWallet({chain: 'BTC', currency: 'BTC', privateKey: wallet.export().privateKey});
    console.log('\nWallet.importPrivateWallet BTC P2PKH....................................:');
    console.log(wallet.export());

    console.log('\nWallet.publicKey2address....................................P2PKH:');
    console.log(KofoWallet.publicToAddress({chain: 'BTC', currency: 'BTC', publicKey: wallet.export().publicKey}));


    wallet = KofoWallet.importPrivateWallet({
        chain: 'BTC',
        currency: 'BTC',
        privateKey: 'KxWWBrVMzr87YMj3oj9z7viDWagiMMP4Znw6iRKAuF7utkQeo22D',
        walletType: 'P2SH'
    });
    console.log('\nWallet.importPrivateWallet P2SH....................................:');
    console.log(wallet.export());

    wallet = KofoWallet.importPrivateWallet({
        chain: 'BTC',
        currency: 'BTC',
        privateKey: 'L4djGpF8XrBoNQKitkT4S398Q8NijEzcdWayGPCS4hXnMDMTfbk2',
        walletType: 'P2SH'
    });
    console.log('\nWallet.importPrivateWallet P2SH....................................:');
    console.log(wallet.export());

    wallet = KofoWallet.importPrivateWallet({
        chain: 'BTC',
        currency: 'BTC',
        privateKey: 'L4djGpF8XrBoNQKitkT4S398Q8NijEzcdWayGPCS4hXnMDMTfbk2'
    });
    console.log('\nWallet.importPrivateWallet P2PKH....................................:');
    console.log(wallet.export());

    signed = wallet.sign([
        "fae236fc785645e5f9bce9a029bb594c8c87bb90f308c5b59837535b65750f4b"
    ]);
    console.log(`\n${wallet.export().chain} wallet sign result:`);
    console.log(signed);


    wallet = KofoWallet.createWallet({chain: 'BTC', currency: 'BTC', walletType: 'P2SH'});
    console.log(`\n KofoWallet.createWallet BTC P2SH....................................:`);
    console.log(wallet.export());
    console.log('========================================BTC========================================end\n\n');




}
runTest().catch(console.log);