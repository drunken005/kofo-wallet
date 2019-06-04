const {Wallet: __wallet__, utils} = require("ethers");

class BaseWallet {
    constructor({identifier, mnemonic, path}) {
        this.identifier = identifier;
        this.path = path || utils.HDNode.defaultPath; //More info on https://github.com/satoshilabs/slips/blob/master/slip-0044.md
        this.mnemonic = mnemonic;
    }

    get privateKey() {
        return this.wallet.privateKey;
    }

    get publicKey() {
        return this.wallet.signingKey.publicKey;
    }

    get address() {
        return this.wallet.address;
    }

    get _mnemonic() {
        return "";
    }

    async sign(data) {
        let transaction = utils.parseTransaction(data);
        return await this.wallet.sign(transaction);
    }

    export() {
        return {
            chain: this.identifier.chain,
            currency: this.identifier.currency,
            privateKey: this.privateKey,
            publicKey: this.publicKey,
            address: this.address,
            mnemonic: this._mnemonic,
            path: this.wallet.path
        };
    }

    async exportKeyStore(password) {
        return await this.wallet.encrypt(password);
    }
}

class PrivateWallet extends BaseWallet {
    constructor(options) {
        super(options);
        this.wallet = new __wallet__(options.privateKey);
    }
}

class MnemonicWallet extends BaseWallet {
    constructor(options) {
        super(options);
        this.wallet = options.mnemonic ? __wallet__.fromMnemonic(options.mnemonic, this.path) : __wallet__.createRandom({path: this.path});
    }

    get _mnemonic() {
        return this.wallet.mnemonic;
    }
}

class Wallet {
    static importPrivateWallet(options) {
        if (!options.privateKey) {
            throw new Error(`Invalid privateKey=${options.privateKey}`);
        }

        return new PrivateWallet(options);
    }

    static createWallet(options) {
        return new MnemonicWallet(options);
    }

    static importMnemonicWallet(options) {
        if (!options.mnemonic) {
            throw new Error(`Invalid mnemonic=${options.mnemonic}`);
        }

        return new MnemonicWallet(options);
    }

    static async importKeyStoreWallet({identifier, data, password}) {
        let fromEncryptedJson = await __wallet__.fromEncryptedJson(data, password);
        if (!!fromEncryptedJson.mnemonic) {
            return Wallet.importMnemonicWallet({
                identifier,
                mnemonic: fromEncryptedJson.mnemonic,
            });
        }

        return Wallet.importPrivateWallet({
            identifier,
            privateKey: fromEncryptedJson.privateKey,
        });
    }

    static publicToAddress({publicKey}) {
        return utils.computeAddress(publicKey);
    }
}

module.exports = Wallet;


//Test code
/*


async function test() {
    const Identifier = require('../../identifier');
    const identifier = new Identifier('ETH', 'ETH');
    const mnemonic = 'add crush thunder useless kingdom trumpet rebuild sauce pudding tone grocery burden';
    const privateKey = '0x1a00ccd213f2de12b00d28a6789e38173394e34dd91042a510cf25ec838eb659';
    const password = '123456axc';

    let wallet = Wallet.importMnemonicWallet({identifier, mnemonic});
    console.log('\nWallet.importMnemonicWallet.......................');
    console.log(wallet.export());

    let keystore = await wallet.exportKeyStore(password);
    console.log('\nWallet.exportKeyStore MnemonicWallet...............');
    console.log(keystore);

    wallet = await Wallet.importKeyStoreWallet({identifier, data: keystore, password});
    console.log('\nWallet.importKeyStoreWallet MnemonicWallet............');
    console.log(wallet.export());


    wallet = await Wallet.importPrivateWallet({identifier, privateKey});
    console.log('\nWallet.importPrivateWallet.......................');
    console.log(wallet.export());

    keystore = await wallet.exportKeyStore(password);
    console.log('\nWallet.exportKeyStore PrivateWallet...............');
    console.log(keystore);

    wallet = await Wallet.importKeyStoreWallet({identifier, data: keystore, password});
    console.log('\nWallet.importKeyStoreWallet PrivateWallet............');
    console.log(wallet.export())




}

test().catch(console.log)

*/




