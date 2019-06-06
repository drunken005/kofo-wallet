const {Wallet: __wallet__, utils} = require("ethers");

class BaseWallet {
    constructor({identifier, mnemonic, language, path}) {
        this.identifier = identifier;
        this.path = path || utils.HDNode.defaultPath; //More info on https://github.com/satoshilabs/slips/blob/master/slip-0044.md
        this.mnemonic = mnemonic;
        this.language = language || 'en';
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

    get _seed() {
        return '';
    }

    async sign(data) {
        let transaction = utils.parseTransaction(data);
        return await this.wallet.sign(transaction);
    }

    export() {
        let _export = this.identifier.export();
        return Object.assign(_export, {
            privateKey: this.privateKey,
            publicKey: this.publicKey,
            address: this.address,

            mnemonic: this._mnemonic,
            language: this.language,
            path: this.path,
            seed: this._seed,
        });
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
        this.wallet = this.mnemonic ? __wallet__.fromMnemonic(this.mnemonic, this.path) : __wallet__.createRandom({path: this.path});
    }

    get _mnemonic() {
        return this.wallet.mnemonic;
    }

    get _seed() {
        return utils.HDNode.mnemonicToSeed(this.wallet.mnemonic);
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

    static async importKeyStoreWallet({identifier, keystore, password}) {
        let fromEncryptedJson = await __wallet__.fromEncryptedJson(keystore, password);
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



