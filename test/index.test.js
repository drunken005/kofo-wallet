const assert = require('assert');
const _ = require('lodash');
const KofoWallet = require('..');
const {RawTransaction} = require('binance-utils');

describe('KOFO-WALLET', () => {
    let BTC = {}, ETH = {}, HPB={}, EOS = {}, ZIL = {}, BNB = {};

    it('#KofoWallet.supportsChain should return string ', function () {
        let result = KofoWallet.supportsChain;
        assert.strictEqual(typeof result, 'string');
        assert.ok(result.indexOf('BTC') >= 0);
        assert.ok(result.indexOf('EOS') >= 0);
        assert.ok(result.indexOf('ETH') >= 0);

    });

    it('#KofoWallet.createWallets should return multi chain wallets', function () {
        let wallets = KofoWallet.createWallets('testnet', 'P2PKH');
        assert.ok(_.isObject(wallets));
        assert.ok(wallets.ETH.export().hasOwnProperty('privateKey'));
        assert.ok(wallets.BTC.export().hasOwnProperty('mnemonic'));
        assert.ok(wallets.EOS.export().hasOwnProperty('seed'));
        assert.ok(wallets.ZIL.export().hasOwnProperty('path'));
        assert.ok(_.isFunction(wallets.MEETONE.sign));
        assert.ok(wallets.BTC.export().hasOwnProperty('walletType') && wallets.BTC.export().walletType === 'P2PKH');
    });

    describe('BTC', () => {
        const params = {chain: 'BTC', currency: 'BTC'};
        let wallet, mnemonic, privateKey, createWallet;

        it('#Kofo.createWallet P2PKH', async () => {
            wallet = KofoWallet.createWallet(params);
            createWallet = wallet.export();
            let _export = wallet.export();
            mnemonic = _export.mnemonic;
            privateKey = _export.privateKey;

            assert.strictEqual(_export.chain, params.chain);
            assert.strictEqual(_export.currency, params.currency);

            assert.ok(_export.hasOwnProperty('privateKey') && _export.privateKey && _.isString(_export.privateKey));
            assert.ok(_export.hasOwnProperty('publicKey') && _export.publicKey && _.isString(_export.publicKey));
            assert.ok(_export.hasOwnProperty('address') && _export.address && _.isString(_export.address));
            assert.ok(_export.hasOwnProperty('mnemonic') && _export.mnemonic && _.isString(_export.mnemonic));
            assert.ok(_export.hasOwnProperty('path') && _export.path && _.isString(_export.path));
            assert.ok(_export.hasOwnProperty('seed') && _export.seed && _.isString(_export.seed));
            assert.ok(_export.hasOwnProperty('walletType') && _export.walletType && _.isString(_export.walletType));

            assert.strictEqual(_export.walletType, 'P2PKH');
            assert.strictEqual(_export.network, 'livenet');
            assert.strictEqual(_export.address.substr(0, 1), '1');
            assert.ok(_.isFunction(wallet.sign));

            BTC.createWallet_P2PKH = _export;

        });

        it('#KofoWallet.importPrivateWallet P2PKH', async () => {
            wallet = KofoWallet.importPrivateWallet(_.assign({}, params, {privateKey}));
            let _export = wallet.export();
            assert.strictEqual(_export.chain, params.chain);
            assert.strictEqual(_export.currency, params.currency);

            assert.strictEqual(_export.privateKey, createWallet.privateKey);
            assert.strictEqual(_export.address, createWallet.address);
            assert.strictEqual(_export.publicKey, createWallet.publicKey);

            assert.ok(_export.hasOwnProperty('privateKey') && _export.privateKey && _.isString(_export.privateKey));
            assert.ok(_export.hasOwnProperty('publicKey') && _export.publicKey && _.isString(_export.publicKey));
            assert.ok(_export.hasOwnProperty('address') && _export.address && _.isString(_export.address));
            assert.ok(_export.hasOwnProperty('mnemonic') && !_export.mnemonic && _.isString(_export.seed));
            assert.ok(_export.hasOwnProperty('path') && _export.path && _.isString(_export.path));
            assert.ok(_export.hasOwnProperty('seed') && !_export.seed && _.isString(_export.seed));
            assert.ok(_export.hasOwnProperty('walletType') && _export.walletType && _.isString(_export.walletType));

            assert.strictEqual(_export.walletType, createWallet.walletType, 'P2PKH');
            assert.strictEqual(_export.path, createWallet.path);
            assert.strictEqual(_export.network, 'livenet');
            assert.strictEqual(_export.address.substr(0, 1), '1', createWallet.address);

            assert.ok(_.isFunction(wallet.sign));
            BTC.importPrivateWallet_P2PKH = _export;
        });


        it('#KofoWallet.importMnemonicWallet P2PKH', async () => {
            wallet = KofoWallet.importMnemonicWallet(_.assign({}, params, {mnemonic}));
            let _export = wallet.export();

            assert.strictEqual(_export.chain, params.chain);
            assert.strictEqual(_export.currency, params.currency);

            assert.strictEqual(_export.privateKey, createWallet.privateKey);
            assert.strictEqual(_export.address, createWallet.address);
            assert.strictEqual(_export.publicKey, createWallet.publicKey);
            assert.strictEqual(_export.mnemonic, createWallet.mnemonic);
            assert.strictEqual(_export.path, createWallet.path);
            assert.strictEqual(_export.seed, createWallet.seed);

            assert.strictEqual(_export.address.substr(0, 1), '1');
            assert.strictEqual(_export.walletType, createWallet.walletType, 'P2PKH');

            assert.ok(_export.hasOwnProperty('privateKey') && _export.privateKey && _.isString(_export.privateKey));
            assert.ok(_export.hasOwnProperty('publicKey') && _export.publicKey && _.isString(_export.publicKey));
            assert.ok(_export.hasOwnProperty('address') && _export.address && _.isString(_export.address));
            assert.ok(_export.hasOwnProperty('mnemonic') && _export.mnemonic && _.isString(_export.mnemonic));
            assert.ok(_export.hasOwnProperty('path') && _export.path && _.isString(_export.path));
            assert.ok(_export.hasOwnProperty('seed') && _export.seed && _.isString(_export.seed));
            assert.ok(_export.hasOwnProperty('walletType') && _export.walletType && _.isString(_export.walletType));
            assert.ok(_.isFunction(wallet.sign));

            BTC.importMnemonicWallet_P2PKH = _export;

        });
        it('#KofoWallet.publicToAddress P2PKH', async () => {
            let address = KofoWallet.publicToAddress(_.assign({}, params, {publicKey: createWallet.publicKey}));
            assert.strictEqual(address, createWallet.address);
            assert.strictEqual(address.substr(0, 1), '1');
        });


        it('#KofoWallet.importPrivateWallet P2SH', async () => {
            wallet = KofoWallet.importPrivateWallet(_.assign({}, params, {privateKey, walletType: 'P2SH'}));
            let _export = wallet.export();
            assert.strictEqual(_export.chain, params.chain);
            assert.strictEqual(_export.currency, params.currency);

            assert.strictEqual(_export.privateKey, createWallet.privateKey);
            assert.notStrictEqual(_export.address, createWallet.address);
            assert.notStrictEqual(_export.walletType, createWallet.walletType);
            assert.strictEqual(_export.walletType, 'P2SH');
            assert.strictEqual(_export.publicKey, createWallet.publicKey);
            assert.notStrictEqual(_export.path, createWallet.path);

            assert.ok(_export.hasOwnProperty('privateKey') && _export.privateKey && _.isString(_export.privateKey));
            assert.ok(_export.hasOwnProperty('publicKey') && _export.publicKey && _.isString(_export.publicKey));
            assert.ok(_export.hasOwnProperty('address') && _export.address && _.isString(_export.address));
            assert.ok(_export.hasOwnProperty('mnemonic') && !_export.mnemonic && _.isString(_export.seed));
            assert.ok(_export.hasOwnProperty('path') && _export.path && _.isString(_export.path));
            assert.ok(_export.hasOwnProperty('seed') && !_export.seed && _.isString(_export.seed));
            assert.ok(_export.hasOwnProperty('walletType') && _export.walletType && _.isString(_export.walletType));

            assert.strictEqual(_export.network, 'livenet');
            assert.strictEqual(_export.address.substr(0, 1), '3');

            assert.ok(_.isFunction(wallet.sign));
            BTC.importPrivateWallet_P2SH = _export;
        });


        it('#KofoWallet.importMnemonicWallet P2SH', async () => {
            wallet = KofoWallet.importMnemonicWallet(_.assign({}, params, {mnemonic, walletType: 'P2SH'}));
            let _export = wallet.export();

            assert.strictEqual(_export.chain, params.chain);
            assert.strictEqual(_export.currency, params.currency);

            assert.notStrictEqual(_export.privateKey, createWallet.privateKey);
            assert.notStrictEqual(_export.address, createWallet.address);
            assert.notStrictEqual(_export.publicKey, createWallet.publicKey);
            assert.strictEqual(_export.mnemonic, createWallet.mnemonic);
            assert.notStrictEqual(_export.path, createWallet.path);
            assert.strictEqual(_export.seed, createWallet.seed);
            assert.notStrictEqual(_export.walletType, createWallet.walletType);

            assert.strictEqual(_export.address.substr(0, 1), '3');
            assert.strictEqual(_export.walletType, 'P2SH');

            assert.ok(_export.hasOwnProperty('privateKey') && _export.privateKey && _.isString(_export.privateKey));
            assert.ok(_export.hasOwnProperty('publicKey') && _export.publicKey && _.isString(_export.publicKey));
            assert.ok(_export.hasOwnProperty('address') && _export.address && _.isString(_export.address));
            assert.ok(_export.hasOwnProperty('mnemonic') && _export.mnemonic && _.isString(_export.mnemonic));
            assert.ok(_export.hasOwnProperty('path') && _export.path && _.isString(_export.path));
            assert.ok(_export.hasOwnProperty('seed') && _export.seed && _.isString(_export.seed));
            assert.ok(_export.hasOwnProperty('walletType') && _export.walletType && _.isString(_export.walletType));

            assert.ok(_.isFunction(wallet.sign));

            BTC.importMnemonicWallet_P2SH = _export;

        });
        it('#KofoWallet.publicToAddress P2SH', async () => {
            let address = KofoWallet.publicToAddress(_.assign({}, params, {
                publicKey: wallet.publicKey,
                walletType: 'P2SH'
            }));
            assert.strictEqual(address, wallet.address);
            assert.strictEqual(address.substr(0, 1), '3');
        });


        it('#Kofo.createWallet P2SH', async () => {
            wallet = KofoWallet.createWallet(_.assign({}, params, {walletType: 'P2SH'}));

            let _export = wallet.export();
            assert.strictEqual(_export.chain, params.chain);
            assert.strictEqual(_export.currency, params.currency);

            assert.ok(_export.hasOwnProperty('privateKey') && _export.privateKey && _.isString(_export.privateKey));
            assert.ok(_export.hasOwnProperty('publicKey') && _export.publicKey && _.isString(_export.publicKey));
            assert.ok(_export.hasOwnProperty('address') && _export.address && _.isString(_export.address));
            assert.ok(_export.hasOwnProperty('mnemonic') && _export.mnemonic && _.isString(_export.mnemonic));
            assert.ok(_export.hasOwnProperty('path') && _export.path && _.isString(_export.path));
            assert.ok(_export.hasOwnProperty('seed') && _export.seed && _.isString(_export.seed));
            assert.ok(_export.hasOwnProperty('walletType') && _export.walletType && _.isString(_export.walletType));

            assert.strictEqual(_export.walletType, 'P2SH');
            assert.strictEqual(_export.network, 'livenet');
            assert.strictEqual(_export.address.substr(0, 1), '3');
            assert.ok(_.isFunction(wallet.sign));

            BTC.createWallet_P2SH = _export;

        });

        it('#KofoWallet.sign rawTransaction', async () => {
            let rawTransaction = [
                "e8c004784f5dbb06f710ff2f4c97c5c224515f22c7d0ef842bbf604e3368e1ac",
                "95a11182444cb7bf0af687db941e40047baf8c095ed93c1865bb55e45bb00d27"
            ];
            let signedTransaction = await wallet.sign(rawTransaction);
            assert.ok(_.isArray(signedTransaction));
            assert.strictEqual(signedTransaction.length, 2);
        });

    });

    describe('ETH', () => {
        const params = {chain: 'ETH', currency: 'ETH'};
        let wallet, mnemonic, privateKey, createWallet, keystore, keystorePassword = 'passw0rd';

        it('#Kofo.createWallet', async () => {
            wallet = KofoWallet.createWallet(params);
            createWallet = wallet.export();
            let _export = wallet.export();
            mnemonic = _export.mnemonic;
            privateKey = _export.privateKey;

            assert.strictEqual(_export.chain, params.chain);
            assert.strictEqual(_export.currency, params.currency);

            assert.ok(_export.hasOwnProperty('privateKey') && _export.privateKey && _.isString(_export.privateKey));
            assert.ok(_export.hasOwnProperty('publicKey') && _export.publicKey && _.isString(_export.publicKey));
            assert.ok(_export.hasOwnProperty('address') && _export.address && _.isString(_export.address));
            assert.ok(_export.hasOwnProperty('mnemonic') && _export.mnemonic && _.isString(_export.mnemonic));
            assert.ok(_export.hasOwnProperty('path') && _export.path && _.isString(_export.path));
            assert.ok(_.isFunction(wallet.sign));

            keystore = await wallet.exportKeyStore(keystorePassword);
            assert.ok(_.isString(keystore));
            ETH.createWallet = _export;

        });

        it('#KofoWallet.importPrivateWallet', async () => {
            wallet = KofoWallet.importPrivateWallet(_.assign({}, params, {privateKey}));
            let _export = wallet.export();

            assert.strictEqual(_export.chain, params.chain);
            assert.strictEqual(_export.currency, params.currency);

            assert.strictEqual(_export.privateKey, createWallet.privateKey);
            assert.strictEqual(_export.address, createWallet.address);
            assert.strictEqual(_export.publicKey, createWallet.publicKey);

            assert.ok(_export.hasOwnProperty('privateKey') && _export.privateKey && _.isString(_export.privateKey));
            assert.ok(_export.hasOwnProperty('publicKey') && _export.publicKey && _.isString(_export.publicKey));
            assert.ok(_export.hasOwnProperty('address') && _export.address && _.isString(_export.address));
            assert.ok(_export.hasOwnProperty('mnemonic') && !_export.mnemonic);
            assert.ok(_export.hasOwnProperty('path') && _export.path);
            assert.ok(_.isFunction(wallet.sign));
            ETH.importPrivateWallet = _export;

        });


        it('#KofoWallet.importMnemonicWallet', async () => {
            wallet = KofoWallet.importMnemonicWallet(_.assign({}, params, {mnemonic}));
            let _export = wallet.export();

            assert.strictEqual(_export.chain, params.chain);
            assert.strictEqual(_export.currency, params.currency);

            assert.strictEqual(_export.privateKey, createWallet.privateKey);
            assert.strictEqual(_export.address, createWallet.address);
            assert.strictEqual(_export.publicKey, createWallet.publicKey);
            assert.strictEqual(_export.mnemonic, createWallet.mnemonic);
            assert.strictEqual(_export.path, createWallet.path);

            assert.ok(_export.hasOwnProperty('privateKey') && _export.privateKey && _.isString(_export.privateKey));
            assert.ok(_export.hasOwnProperty('publicKey') && _export.publicKey && _.isString(_export.publicKey));
            assert.ok(_export.hasOwnProperty('address') && _export.address && _.isString(_export.address));
            assert.ok(_export.hasOwnProperty('mnemonic') && _export.mnemonic && _.isString(_export.mnemonic));
            assert.ok(_export.hasOwnProperty('path') && _export.path && _.isString(_export.path));
            assert.ok(_.isFunction(wallet.sign));
            ETH.importMnemonicWallet = _export;

        });

        it('#KofoWallet.importKeyStoreWallet', async () => {
            wallet = await KofoWallet.importKeyStoreWallet(_.assign({}, params, {
                keystore: keystore,
                password: keystorePassword
            }));
            let _export = wallet.export();
            assert.strictEqual(_export.chain, params.chain);
            assert.strictEqual(_export.currency, params.currency);

            assert.strictEqual(_export.privateKey, createWallet.privateKey);
            assert.strictEqual(_export.address, createWallet.address);
            assert.strictEqual(_export.publicKey, createWallet.publicKey);
            assert.strictEqual(_export.mnemonic, createWallet.mnemonic);
            assert.strictEqual(_export.path, createWallet.path);

            assert.ok(_export.hasOwnProperty('privateKey') && _export.privateKey && _.isString(_export.privateKey));
            assert.ok(_export.hasOwnProperty('publicKey') && _export.publicKey && _.isString(_export.publicKey));
            assert.ok(_export.hasOwnProperty('address') && _export.address && _.isString(_export.address));
            assert.ok(_export.hasOwnProperty('mnemonic') && _export.mnemonic && _.isString(_export.mnemonic));
            assert.ok(_export.hasOwnProperty('path') && _export.path && _.isString(_export.path));
            assert.ok(_.isFunction(wallet.sign));

            ETH.importKeyStoreWallet = _export;
        });

        it('##KofoWallet.importKeyStoreWallet error password', async () => {
            try {
                wallet = await KofoWallet.importKeyStoreWallet(_.assign({}, params, {
                    keystore: keystore,
                    password: 'passw1rd'
                }));
            } catch (e) {
                assert.strictEqual(e.message, 'invalid password')
            }
        });

        it('#KofoWallet.publicToAddress', async () => {
            let address = KofoWallet.publicToAddress(_.assign({}, params, {publicKey: createWallet.publicKey}));
            assert.strictEqual(address, createWallet.address);
        });

        it('#KofoWallet.sign rawTransaction', async () => {
            let rawTransaction = '0xf88e0c8501dcd650008304baf094cdfe62b84e8e2c1bf0888b20fe875799a3a82f9487010dc639bbb800b864a80de0e800000000000000000000000064972593901e8c014ec5d39dfa8d879a3ba62bfdfe38c3e0af6375b3d9eb38d74931c277638cc655aa4a01e618b256950ee8643b0000000000000000000000000000000000000000000000000000000000723279';
            let signedTransaction = await wallet.sign(rawTransaction);
            assert.ok(_.isString(signedTransaction));
            assert.strictEqual(signedTransaction.substr(0, 2), '0x');
        });

    });

    describe('HPB', () => {
        const params = {chain: 'HPB', currency: 'HPB', network: 'testnet'};
        let wallet, mnemonic, privateKey, createWallet, keystore, keystorePassword = 'passw0rd';

        it('#Kofo.createWallet', async () => {
            wallet = KofoWallet.createWallet(params);
            createWallet = wallet.export();
            let _export = wallet.export();
            mnemonic = _export.mnemonic;
            privateKey = _export.privateKey;

            assert.strictEqual(_export.chain, params.chain);
            assert.strictEqual(_export.currency, params.currency);

            assert.ok(_export.hasOwnProperty('privateKey') && _export.privateKey && _.isString(_export.privateKey));
            assert.ok(_export.hasOwnProperty('publicKey') && _export.publicKey && _.isString(_export.publicKey));
            assert.ok(_export.hasOwnProperty('address') && _export.address && _.isString(_export.address));
            assert.ok(_export.hasOwnProperty('mnemonic') && _export.mnemonic && _.isString(_export.mnemonic));
            assert.ok(_export.hasOwnProperty('path') && _export.path && _.isString(_export.path));
            assert.ok(_.isFunction(wallet.sign));

            keystore = await wallet.exportKeyStore(keystorePassword);
            assert.ok(_.isString(keystore));
            HPB.createWallet = _export;

        });

        it('#KofoWallet.importPrivateWallet', async () => {
            wallet = KofoWallet.importPrivateWallet(_.assign({}, params, {privateKey}));
            let _export = wallet.export();

            assert.strictEqual(_export.chain, params.chain);
            assert.strictEqual(_export.currency, params.currency);

            assert.strictEqual(_export.privateKey, createWallet.privateKey);
            assert.strictEqual(_export.address, createWallet.address);
            assert.strictEqual(_export.publicKey, createWallet.publicKey);

            assert.ok(_export.hasOwnProperty('privateKey') && _export.privateKey && _.isString(_export.privateKey));
            assert.ok(_export.hasOwnProperty('publicKey') && _export.publicKey && _.isString(_export.publicKey));
            assert.ok(_export.hasOwnProperty('address') && _export.address && _.isString(_export.address));
            assert.ok(_export.hasOwnProperty('mnemonic') && !_export.mnemonic);
            assert.ok(_export.hasOwnProperty('path') && _export.path);
            assert.ok(_.isFunction(wallet.sign));
            HPB.importPrivateWallet = _export;

        });


        it('#KofoWallet.importMnemonicWallet', async () => {
            wallet = KofoWallet.importMnemonicWallet(_.assign({}, params, {mnemonic}));
            let _export = wallet.export();

            assert.strictEqual(_export.chain, params.chain);
            assert.strictEqual(_export.currency, params.currency);

            assert.strictEqual(_export.privateKey, createWallet.privateKey);
            assert.strictEqual(_export.address, createWallet.address);
            assert.strictEqual(_export.publicKey, createWallet.publicKey);
            assert.strictEqual(_export.mnemonic, createWallet.mnemonic);
            assert.strictEqual(_export.path, createWallet.path);

            assert.ok(_export.hasOwnProperty('privateKey') && _export.privateKey && _.isString(_export.privateKey));
            assert.ok(_export.hasOwnProperty('publicKey') && _export.publicKey && _.isString(_export.publicKey));
            assert.ok(_export.hasOwnProperty('address') && _export.address && _.isString(_export.address));
            assert.ok(_export.hasOwnProperty('mnemonic') && _export.mnemonic && _.isString(_export.mnemonic));
            assert.ok(_export.hasOwnProperty('path') && _export.path && _.isString(_export.path));
            assert.ok(_.isFunction(wallet.sign));
            HPB.importMnemonicWallet = _export;

        });

        it('#KofoWallet.importKeyStoreWallet', async () => {
            wallet = await KofoWallet.importKeyStoreWallet(_.assign({}, params, {
                keystore: keystore,
                password: keystorePassword
            }));
            let _export = wallet.export();
            assert.strictEqual(_export.chain, params.chain);
            assert.strictEqual(_export.currency, params.currency);

            assert.strictEqual(_export.privateKey, createWallet.privateKey);
            assert.strictEqual(_export.address, createWallet.address);
            assert.strictEqual(_export.publicKey, createWallet.publicKey);
            assert.strictEqual(_export.mnemonic, createWallet.mnemonic);
            assert.strictEqual(_export.path, createWallet.path);

            assert.ok(_export.hasOwnProperty('privateKey') && _export.privateKey && _.isString(_export.privateKey));
            assert.ok(_export.hasOwnProperty('publicKey') && _export.publicKey && _.isString(_export.publicKey));
            assert.ok(_export.hasOwnProperty('address') && _export.address && _.isString(_export.address));
            assert.ok(_export.hasOwnProperty('mnemonic') && _export.mnemonic && _.isString(_export.mnemonic));
            assert.ok(_export.hasOwnProperty('path') && _export.path && _.isString(_export.path));
            assert.ok(_.isFunction(wallet.sign));

            HPB.importKeyStoreWallet = _export;
        });

        it('##KofoWallet.importKeyStoreWallet error password', async () => {
            try {
                wallet = await KofoWallet.importKeyStoreWallet(_.assign({}, params, {
                    keystore: keystore,
                    password: 'passw1rd'
                }));
            } catch (e) {
                assert.strictEqual(e.message, 'invalid password')
            }
        });

        it('#KofoWallet.publicToAddress', async () => {
            let address = KofoWallet.publicToAddress(_.assign({}, params, {publicKey: createWallet.publicKey}));
            assert.strictEqual(address, createWallet.address);
        });

        it('#KofoWallet.sign rawTransaction', async () => {
            let rawTransaction = "{\"data\":\"\",\"gasLimit\":310000,\"gasPrice\":18000000000,\"nonce\":2,\"to\":\"0x85b4c0bbc220c1d8e657d091db5529bda9008de4\",\"value\":100000000000000}";;
            let signedTransaction = await wallet.sign(rawTransaction);
            assert.ok(_.isString(signedTransaction));
            assert.strictEqual(signedTransaction.substr(0, 2), '0x');
        });

    });

    describe('EOS/BOS/MEETONE', () => {
        const params = {chain: 'EOS', currency: 'EOS'};
        let wallet, mnemonic, privateKey, createWallet;

        //EOS only supports the creation of public-private key pairs, not accounts
        it('#Kofo.createWallet', async () => {
            wallet = KofoWallet.createWallet(params);
            createWallet = wallet.export();
            let _export = wallet.export();
            mnemonic = _export.mnemonic;
            privateKey = _export.privateKey;

            assert.strictEqual(_export.chain, params.chain);
            assert.strictEqual(_export.currency, params.currency);

            assert.ok(_export.hasOwnProperty('privateKey') && _export.privateKey && _.isString(_export.privateKey));
            assert.ok(_export.hasOwnProperty('publicKey') && _export.publicKey && _.isString(_export.publicKey));
            assert.ok(_export.hasOwnProperty('address') && !_export.address && _.isString(_export.address));
            assert.ok(_export.hasOwnProperty('mnemonic') && _export.mnemonic && _.isString(_export.mnemonic));
            assert.ok(_export.hasOwnProperty('path') && _export.path && _.isString(_export.path));
            assert.ok(_.isFunction(wallet.sign));

            EOS.createWallet = _export;

        });

        it('#KofoWallet.importPrivateWallet', async () => {
            wallet = KofoWallet.importPrivateWallet(_.assign({}, params, {privateKey}));
            let _export = wallet.export();

            assert.strictEqual(_export.chain, params.chain);
            assert.strictEqual(_export.currency, params.currency);

            assert.strictEqual(_export.privateKey, createWallet.privateKey);
            assert.strictEqual(_export.publicKey, createWallet.publicKey);

            assert.ok(_export.hasOwnProperty('privateKey') && _export.privateKey && _.isString(_export.privateKey));
            assert.ok(_export.hasOwnProperty('publicKey') && _export.publicKey && _.isString(_export.publicKey));
            assert.ok(_export.hasOwnProperty('address') && !_export.address && _.isString(_export.address));
            assert.ok(_export.hasOwnProperty('mnemonic') && !_export.mnemonic);
            assert.ok(_export.hasOwnProperty('path') && _export.path);
            assert.ok(_.isFunction(wallet.sign));
            EOS.importPrivateWallet = _export;

        });


        it('#KofoWallet.importMnemonicWallet', async () => {
            wallet = KofoWallet.importMnemonicWallet(_.assign({}, params, {mnemonic}));
            let _export = wallet.export();

            assert.strictEqual(_export.chain, params.chain);
            assert.strictEqual(_export.currency, params.currency);

            assert.strictEqual(_export.privateKey, createWallet.privateKey);
            assert.strictEqual(_export.address, createWallet.address);
            assert.strictEqual(_export.publicKey, createWallet.publicKey);
            assert.strictEqual(_export.mnemonic, createWallet.mnemonic);
            assert.strictEqual(_export.path, createWallet.path);

            assert.ok(_export.hasOwnProperty('privateKey') && _export.privateKey && _.isString(_export.privateKey));
            assert.ok(_export.hasOwnProperty('publicKey') && _export.publicKey && _.isString(_export.publicKey));
            assert.ok(_export.hasOwnProperty('mnemonic') && _export.mnemonic && _.isString(_export.mnemonic));
            assert.ok(_export.hasOwnProperty('path') && _export.path && _.isString(_export.path));
            assert.ok(_.isFunction(wallet.sign));
            EOS.importMnemonicWallet = _export;

        });

        it('#KofoWallet.sign rawTransaction', async () => {
            let rawTransaction = ['57ff1ad29d7c0ce27bfd64246b784d434e80a5661da98e67fe16a20d7147dc97'];
            let signedTransaction = await wallet.sign(rawTransaction);
            assert.ok(_.isArray(signedTransaction));
            assert.strictEqual(signedTransaction[0].substr(0, 3), 'SIG');
        });

    });

    describe('ZILLIQA', () => {
        const params = {chain: 'ZIL', currency: 'ZIL'};
        let wallet, mnemonic, privateKey, createWallet, keystore, keystorePassword = 'passw0rd';

        it('#Kofo.createWallet', async () => {
            wallet = KofoWallet.createWallet(params);
            createWallet = wallet.export();
            let _export = wallet.export();
            mnemonic = _export.mnemonic;
            privateKey = _export.privateKey;

            assert.strictEqual(_export.chain, params.chain);
            assert.strictEqual(_export.currency, params.currency);

            assert.ok(_export.hasOwnProperty('privateKey') && _export.privateKey && _.isString(_export.privateKey));
            assert.ok(_export.hasOwnProperty('publicKey') && _export.publicKey && _.isString(_export.publicKey));
            assert.ok(_export.hasOwnProperty('address') && _export.address && _.isString(_export.address));
            assert.ok(_export.hasOwnProperty('mnemonic') && _export.mnemonic && _.isString(_export.mnemonic));
            assert.ok(_export.hasOwnProperty('path') && _export.path && _.isString(_export.path));

            assert.ok(_.isFunction(wallet.sign));
            keystore = await wallet.exportKeyStore(keystorePassword);
            assert.ok(_.isString(keystore));
            ZIL.createWallet = _export;

        });

        it('#KofoWallet.importPrivateWallet', async () => {
            wallet = KofoWallet.importPrivateWallet(_.assign({}, params, {privateKey}));
            let _export = wallet.export();

            assert.strictEqual(_export.chain, params.chain);
            assert.strictEqual(_export.currency, params.currency);

            assert.strictEqual(_export.privateKey, createWallet.privateKey);
            assert.strictEqual(_export.address, createWallet.address);
            assert.strictEqual(_export.publicKey, createWallet.publicKey);

            assert.ok(_export.hasOwnProperty('privateKey') && _export.privateKey && _.isString(_export.privateKey));
            assert.ok(_export.hasOwnProperty('publicKey') && _export.publicKey && _.isString(_export.publicKey));
            assert.ok(_export.hasOwnProperty('address') && _export.address && _.isString(_export.address));
            assert.ok(_export.hasOwnProperty('mnemonic') && !_export.mnemonic);
            assert.ok(_export.hasOwnProperty('path') && _export.path && _.isString(_export.path));

            assert.ok(_.isFunction(wallet.sign));
            ZIL.importPrivateWallet = _export;

        });


        it('#KofoWallet.importMnemonicWallet', async () => {
            wallet = KofoWallet.importMnemonicWallet(_.assign({}, params, {mnemonic}));
            let _export = wallet.export();

            assert.strictEqual(_export.chain, params.chain);
            assert.strictEqual(_export.currency, params.currency);

            assert.strictEqual(_export.privateKey, createWallet.privateKey);
            assert.strictEqual(_export.address, createWallet.address);
            assert.strictEqual(_export.publicKey, createWallet.publicKey);
            assert.strictEqual(_export.mnemonic, createWallet.mnemonic);
            assert.strictEqual(_export.path, createWallet.path);

            assert.ok(_export.hasOwnProperty('privateKey') && _export.privateKey && _.isString(_export.privateKey));
            assert.ok(_export.hasOwnProperty('publicKey') && _export.publicKey && _.isString(_export.publicKey));
            assert.ok(_export.hasOwnProperty('address') && _export.address && _.isString(_export.address));
            assert.ok(_export.hasOwnProperty('mnemonic') && _export.mnemonic && _.isString(_export.mnemonic));
            assert.ok(_export.hasOwnProperty('path') && _export.path && _.isString(_export.path));
            assert.ok(_.isFunction(wallet.sign));
            ZIL.importMnemonicWallet = _export;

        });

        it('#KofoWallet.importKeyStoreWallet', async () => {
            wallet = await KofoWallet.importKeyStoreWallet(_.assign({}, params, {
                keystore: keystore,
                password: keystorePassword
            }));
            let _export = wallet.export();
            assert.strictEqual(_export.chain, params.chain);
            assert.strictEqual(_export.currency, params.currency);

            assert.strictEqual(_export.privateKey, createWallet.privateKey);
            assert.strictEqual(_export.address, createWallet.address);
            assert.strictEqual(_export.publicKey, createWallet.publicKey);
            assert.strictEqual(_export.path, createWallet.path);

            assert.ok(_export.hasOwnProperty('privateKey') && _export.privateKey && _.isString(_export.privateKey));
            assert.ok(_export.hasOwnProperty('publicKey') && _export.publicKey && _.isString(_export.publicKey));
            assert.ok(_export.hasOwnProperty('address') && _export.address && _.isString(_export.address));
            assert.ok(_export.hasOwnProperty('path') && _export.path && _.isString(_export.path));
            assert.ok(_.isFunction(wallet.sign));

            ZIL.importKeyStoreWallet = _export;
        });

        it('##KofoWallet.importKeyStoreWallet error password', async () => {
            try {
                wallet = await KofoWallet.importKeyStoreWallet(_.assign({}, params, {
                    keystore: keystore,
                    password: 'passw1rd'
                }));
            } catch (e) {
                assert.strictEqual(e.message, 'Could not decrypt keystore file.')
            }
        });

        it('#KofoWallet.publicToAddress', async () => {
            let address = KofoWallet.publicToAddress(_.assign({}, params, {publicKey: createWallet.publicKey}));
            assert.strictEqual(address, createWallet.address);
        });

        it('#KofoWallet.sign rawTransaction', async () => {
            let rawTransaction = {
                "amount": "0",
                "code": "",
                "data": "{\"_tag\":\"changeAdminAddress\",\"params\":[{\"type\":\"ByStr20\",\"value\":\"0x7b5f2006dcd9ec22a9f8b7d7c6e34338331b6a86\",\"vname\":\"adminAddress\"}]}",
                "gasLimit": "2000",
                "gasPrice": "1000000000",
                "nonce": "321",
                "senderPubKey": wallet.export().publicKey,
                "toAddr": "6f18B3a0fc9f232eA9Ef951b5e741895e24B15f5",
                "version": "21823496"
            };
            let signedTransaction = await wallet.sign(rawTransaction);

            assert.ok(_.isString(signedTransaction));
            signedTransaction = JSON.parse(signedTransaction);
            assert.ok(signedTransaction.hasOwnProperty('signature') && _.isString(signedTransaction.signature))
        });

    });


    describe('BNB', () => {
        const params = {chain: 'BNB', currency: 'BNB', network: 'testnet'};
        let wallet, mnemonic, privateKey, createWallet, keystore, keystorePassword = 'passw0rd';

        it('#Kofo.createWallet', async () => {
            wallet = KofoWallet.createWallet(params);
            createWallet = wallet.export();
            let _export = wallet.export();
            mnemonic = _export.mnemonic;
            privateKey = _export.privateKey;

            assert.strictEqual(_export.chain, params.chain);
            assert.strictEqual(_export.currency, params.currency);

            assert.ok(_export.hasOwnProperty('privateKey') && _export.privateKey && _.isString(_export.privateKey));
            assert.ok(_export.hasOwnProperty('publicKey') && _export.publicKey && _.isString(_export.publicKey));
            assert.ok(_export.hasOwnProperty('address') && _export.address && _.isString(_export.address));
            assert.ok(_export.hasOwnProperty('mnemonic') && _export.mnemonic && _.isString(_export.mnemonic));
            assert.ok(_export.hasOwnProperty('path') && _export.path && _.isString(_export.path));

            assert.ok(_.isFunction(wallet.sign));
            let exportKeyStore = await wallet.exportKeyStore(keystorePassword);
            keystore = exportKeyStore.keystore;
            assert.ok(_.isObject(keystore));
            BNB.createWallet = _export;
        });

        it('#KofoWallet.importPrivateWallet', async () => {
            wallet = KofoWallet.importPrivateWallet(_.assign({}, params, {privateKey}));
            let _export = wallet.export();

            assert.strictEqual(_export.chain, params.chain);
            assert.strictEqual(_export.currency, params.currency);

            assert.strictEqual(_export.privateKey, createWallet.privateKey);
            assert.strictEqual(_export.address, createWallet.address);
            assert.strictEqual(_export.publicKey, createWallet.publicKey);

            assert.ok(_export.hasOwnProperty('privateKey') && _export.privateKey && _.isString(_export.privateKey));
            assert.ok(_export.hasOwnProperty('publicKey') && _export.publicKey && _.isString(_export.publicKey));
            assert.ok(_export.hasOwnProperty('address') && _export.address && _.isString(_export.address));
            assert.ok(_export.hasOwnProperty('mnemonic') && !_export.mnemonic);
            assert.ok(_export.hasOwnProperty('path') && _export.path && _.isString(_export.path));

            assert.ok(_.isFunction(wallet.sign));
            BNB.importPrivateWallet = _export;

        });


        it('#KofoWallet.importMnemonicWallet', async () => {
            wallet = KofoWallet.importMnemonicWallet(_.assign({}, params, {mnemonic}));
            let _export = wallet.export();

            assert.strictEqual(_export.chain, params.chain);
            assert.strictEqual(_export.currency, params.currency);

            assert.strictEqual(_export.privateKey, createWallet.privateKey);
            assert.strictEqual(_export.address, createWallet.address);
            assert.strictEqual(_export.publicKey, createWallet.publicKey);
            assert.strictEqual(_export.mnemonic, createWallet.mnemonic);
            assert.strictEqual(_export.path, createWallet.path);

            assert.ok(_export.hasOwnProperty('privateKey') && _export.privateKey && _.isString(_export.privateKey));
            assert.ok(_export.hasOwnProperty('publicKey') && _export.publicKey && _.isString(_export.publicKey));
            assert.ok(_export.hasOwnProperty('address') && _export.address && _.isString(_export.address));
            assert.ok(_export.hasOwnProperty('mnemonic') && _export.mnemonic && _.isString(_export.mnemonic));
            assert.ok(_export.hasOwnProperty('path') && _export.path && _.isString(_export.path));
            assert.ok(_.isFunction(wallet.sign));
            BNB.importMnemonicWallet = _export;

        });

        it('#KofoWallet.importKeyStoreWallet', async () => {
            wallet = await KofoWallet.importKeyStoreWallet(_.assign({}, params, {
                keystore: keystore,
                password: keystorePassword
            }));
            let _export = wallet.export();
            assert.strictEqual(_export.chain, params.chain);
            assert.strictEqual(_export.currency, params.currency);

            assert.strictEqual(_export.privateKey, createWallet.privateKey);
            assert.strictEqual(_export.address, createWallet.address);
            assert.strictEqual(_export.publicKey, createWallet.publicKey);
            assert.strictEqual(_export.path, createWallet.path);

            assert.ok(_export.hasOwnProperty('privateKey') && _export.privateKey && _.isString(_export.privateKey));
            assert.ok(_export.hasOwnProperty('publicKey') && _export.publicKey && _.isString(_export.publicKey));
            assert.ok(_export.hasOwnProperty('address') && _export.address && _.isString(_export.address));
            assert.ok(_export.hasOwnProperty('path') && _export.path && _.isString(_export.path));
            assert.ok(_.isFunction(wallet.sign));

            BNB.importKeyStoreWallet = _export;
        });

        it('##KofoWallet.importKeyStoreWallet error password', async () => {
            try {
                wallet = await KofoWallet.importKeyStoreWallet(_.assign({}, params, {
                    keystore: keystore,
                    password: 'passw1rd'
                }));
            } catch (e) {
                assert.ok(e.message.indexOf('wrong password')>0)
            }
        });

        it('#KofoWallet.publicToAddress', async () => {
            let address = KofoWallet.publicToAddress(_.assign({}, params, {publicKey: createWallet.publicKey}));
            assert.strictEqual(address, createWallet.address);
        });

        it('#KofoWallet.sign rawTransaction', async () => {
            const fromAddress = wallet.export().address;
            const toAddress = 'tbnb19453j4a72xh63uuk46j9tcy6amysatdvzgccr0';
            const amount = 1;
            const asset = 'BNB';
            const account_number = 692269;
            const sequence = 5;
            const memo = 'test';
            let transaction = new RawTransaction('testnet');

            let tx = transaction.create('transfer', fromAddress, toAddress, amount, asset, account_number, sequence, memo);
            let signedTransaction = await wallet.sign(tx);
            assert.ok(_.isString(signedTransaction));
        });

    });


    after(() => {
        console.log('\nkofo wallet details:');
        console.log({BTC, ETH, HPB, EOS, ZIL, BNB});
        console.log('\n')
    })

});