const BnbUtils = require('binance-utils');

const NETWORK_PREFIX_MAPPING = {
    "testnet": "tbnb",
    "mainnet": "bnb"
};

const NERWORK = {
    "testnet": "testnet",
    "livenet": "mainnet",
    "mainnet": "mainnet"

};

const HDPATH = "44'/714'/0'/0/0";


class BaseWallet {
    constructor({identifier, mnemonic, network, language, path}) {
        this.identifier = identifier;
        this.mnemonic = mnemonic;
        network = network || NERWORK.livenet;
        this.network = NERWORK[network];
        this.language = language || 'en';
        this.path = path || HDPATH;
    }

    get privateKey() {
        return this.wallet.privateKey;
    }

    get publicKey() {
        return this.wallet.publicKey;
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

    sign(data){
        return this.wallet.sign(data);
    }

    export() {
        let _export = this.identifier.export();
        return Object.assign(_export, {
            privateKey: this.privateKey,
            publicKey: this.publicKey,
            address: this.address,
            network: this.network,

            mnemonic: this._mnemonic,
            language: this.language,
            path: this.path,
            seed: this._seed,
        });
    }

    exportKeyStore(password) {
        return this.wallet.exportKeystore(password);
    }

}


class PrivateWallet extends BaseWallet {
    constructor(options) {
        super(options);
        this.wallet = new BnbUtils.Wallet(options.privateKey, this.network);
    }
}

class MnemonicWallet extends BaseWallet {
    constructor(options) {
        super(options);
        this.wallet = BnbUtils.Wallet.createMnemonicWallet(this.mnemonic, this.network);
    }

    get _mnemonic() {
        return this.wallet.mnemonic;
    }

    get _seed() {
        return this.wallet.seed;
    }
}


class Wallet {
    static importPrivateWallet(options) {
        if (!options.privateKey) {
            throw new Error(`Invalid privateKey=${options.privateKey}`);
        }
        return new PrivateWallet(options);
    }

    /**
     *
     * @param options
     * @returns {MnemonicWallet}
     */
    static createWallet(options) {
        return new MnemonicWallet(options);
    }


    static importMnemonicWallet(options) {
        if (!options.mnemonic) {
            throw new Error(`Invalid mnemonic=${options.mnemonic}`);
        }
        return new MnemonicWallet(options);
    }

    static importKeyStoreWallet({identifier, keystore, password, network}) {
        let privateKey = BnbUtils.crypto.getPrivateKeyFromKeyStore(keystore, password);
        return new PrivateWallet({identifier, network, privateKey})
    }

    static publicToAddress({publicKey, network}) {
        network = network || NERWORK.livenet;
        if (!NERWORK[network]) {
            throw new TypeError('network must be "livenet" or "testnet".');
        }
        network = NERWORK[network];
        return BnbUtils.crypto.getAddressFromPublicKey(publicKey, NETWORK_PREFIX_MAPPING[network]);
    }

}

module.exports = Wallet;