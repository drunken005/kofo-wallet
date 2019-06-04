const ecc = require('eosjs-ecc');
const Mnemonic = require('../btc/mnemonic/mnemonic');
const bip32 = require('bip32');
const WordsForLang = {
    "en": Mnemonic.Words.ENGLISH,
    "es": Mnemonic.Words.SPANISH,
    "ja": Mnemonic.Words.JAPANESE,
    "zh": Mnemonic.Words.CHINESE,
    "fr": Mnemonic.Words.FRENCH,
    "it": Mnemonic.Words.ITALIAN,
};

class BaseWallet {
    constructor({identifier, mnemonic, language, path}) {
        this.identifier = identifier;
        this.language = language || 'en';
        this.path = path || "m/44'/194'/0'/0/0"; //More info on https://github.com/satoshilabs/slips/blob/master/slip-0044.md
        this.mnemonic = mnemonic;
    }

    get _privateKey() {
        return this.privateKey;
    }

    get _publicKey() {
        return ecc.privateToPublic(this._privateKey);
    }

    get address() {
        return '';
    }

    get _mnemonic() {
        return "";
    }

    get _seed() {
        return '';
    }

    async sign(data) {
        if (Array.isArray(data)) {
            let signature = [];
            for (let message of data) {
                signature.push(ecc.signHash(message, this.privateKey));
            }
            return signature;
        } else {
            return ecc.signHash(data, this.privateKey);
        }
    }

    export() {
        return {
            chain: this.identifier.chain,
            currency: this.identifier.currency,
            privateKey: this._privateKey,
            publicKey: this._publicKey,
            address: this.address,
            mnemonic: this._mnemonic,

            language: this.language,
            seed: this._seed,
            path: this.path
        };
    }

    static getMnemonic({language, mnemonic}) {
        let _mnemonic;
        let __language__ = WordsForLang[language];

        if (!!mnemonic) {
            _mnemonic = new Mnemonic(mnemonic);
        } else {
            _mnemonic = new Mnemonic(__language__);
            while (!Mnemonic.isValid(_mnemonic.toString())) {
                _mnemonic = new Mnemonic(__language__);
            }
        }
        return _mnemonic;
    }
}

class PrivateWallet extends BaseWallet {
    constructor(options) {
        super(options);
        this.privateKey = options.privateKey;
    }
}

class MnemonicWallet extends BaseWallet {
    constructor(options) {
        super(options);

        this.instance = BaseWallet.getMnemonic({
            language: this.language,
            mnemonic: this.mnemonic,
        });
        const seed = this.instance.toSeed();
        const root = bip32.fromSeed(seed);
        let BIP32 = root.derivePath(this.path);
        this.privateKey = ecc.seedPrivate(BIP32.privateKey.toString('hex'));
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
        return publicKey;
    }
}

module.exports = Wallet;



