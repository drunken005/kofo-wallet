const {utils} = require("ethers");
const DEFAULT_PATH = "m/44'/195'/0'/0/0";
const bip32 = require('bip32');
const Mnemonic = require('../btc/mnemonic/mnemonic');
const {hexStr2byteArray, byteArray2hexStr} = require('./utils/code');
const {getAddressFromPriKey, getBase58CheckAddress, getPubKeyFromPriKey, computeAddress} = require('./utils/crypto');

class BaseWallet {
    constructor({identifier, mnemonic, language, path}) {
        this.identifier = identifier;
        this.path = path || DEFAULT_PATH; //More info on https://github.com/satoshilabs/slips/blob/master/slip-0044.md
        this.mnemonic = mnemonic;
        this.language = language || 'en';
    }

    get privateKey() {
        return this.wallet.privateKey;
    }

    get publicKey() {
        const pubKeyBytes = getPubKeyFromPriKey(this.wallet.priKeyBytes);
        return byteArray2hexStr(pubKeyBytes);
    }

    get address() {
        const addressBytes = getAddressFromPriKey(this.wallet.priKeyBytes);
        return getBase58CheckAddress(addressBytes);
    }

    get _mnemonic() {
        return "";
    }

    get _seed() {
        return '';
    }

    async sign(data) {
        console.info('Currency chain not supported');
        return '';
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
}

class PrivateWallet extends BaseWallet {
    constructor(options) {
        super(options);
        let privateKey = options.privateKey;
        let priKeyBytes = hexStr2byteArray(privateKey);
        this.wallet = {
            privateKey,
            priKeyBytes
        };
    }
}

class MnemonicWallet extends BaseWallet {
    constructor(options) {
        super(options);
        this.instance = Mnemonic.getMnemonic(this.language, this.mnemonic);
        const seed = this.instance.toSeed();
        const root = bip32.fromSeed(seed);
        let BIP32 = root.derivePath(this.path);
        let privateKey = BIP32.privateKey.toString('hex');
        let priKeyBytes = hexStr2byteArray(privateKey);
        this.wallet = {
            privateKey,
            priKeyBytes
        };
    }

    get _mnemonic() {
        return this.instance.phrase;
    }

    get _seed() {
        return this.instance.toSeed().toString("hex");
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


    static publicToAddress({publicKey}) {
        if (typeof publicKey !== 'string')
            throw new Error('The publicKey is not a string');

        const pubKeyBytes = hexStr2byteArray(publicKey);
        const addressBytes = computeAddress(pubKeyBytes);

        //hex
        //byteArray2hexStr(addressBytes)

        // base58
        return getBase58CheckAddress(addressBytes);
    }
}

module.exports = Wallet;