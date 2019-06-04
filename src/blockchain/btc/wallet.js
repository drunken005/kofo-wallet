const Mnemonic = require("./mnemonic/mnemonic");
const Bitcore = require('bitcore-lib');
const Bitcoin = require('bitcoinjs-lib');
const ECDSA = Bitcore.crypto.ECDSA;
const Signature = Bitcore.crypto.Signature;
const DEFAULT_NETWORK = 'livenet';
const {p2sh: __p2sh__, p2wpkh: __p2wpkh__} = Bitcoin.payments;

const WordsForLang = {
    "en": Mnemonic.Words.ENGLISH,
    "es": Mnemonic.Words.SPANISH,
    "ja": Mnemonic.Words.JAPANESE,
    "zh": Mnemonic.Words.CHINESE,
    "fr": Mnemonic.Words.FRENCH,
    "it": Mnemonic.Words.ITALIAN,
};

const _NETWORKS = {
    'livenet': Bitcoin.networks.bitcoin,
    'mainnet': Bitcoin.networks.bitcoin,
    'testnet': Bitcoin.networks.testnet
};

/**
 * More info on https://en.bitcoin.it/wiki/Address
 * @type {{P2SH: string, P2PKH: string}}
 */
const WALLET_TYPE = {
    P2PKH: 'P2PKH', //P2PKH which begin with the number 1
    P2SH: 'P2SH' //P2SH type starting with the number 3
};

/**
 * More info on https://github.com/bitcoin/bips/blob/master/bip-0044.mediawiki
 * @type {{P2SH: string, P2PKH: string}}
 */
const DEFAULT_WALLET_PATH = {
    P2PKH: "m/44'/0'/0'/0/0",
    P2SH: "m/49'/0'/0'/0/0"
};

/**
 *
 */
class BaseWallet {
    constructor({identifier, mnemonic, network, passphrase, language, walletType, path}) {
        this.identifier = identifier;
        this.mnemonic = mnemonic;
        this.network = network || DEFAULT_NETWORK;
        this.passphrase = passphrase;
        this.language = language || 'en';
        this.walletType = walletType || WALLET_TYPE.P2PKH;
        if (!WALLET_TYPE[this.walletType]) {
            throw new Error(`Invalid wallet type=${this.walletType}`);
        }
        this.path = path || DEFAULT_WALLET_PATH[this.walletType];
    }

    get privateKey() {
        return this.wallet.toWIF();
    }

    get publicKey() {
        return this.wallet.publicKey.toString();
    }

    get address() {
        return Wallet.publicToAddress({
            publicKey: this.wallet.publicKey,
            network: this.network,
            walletType: this.walletType
        })

    }

    get _mnemonic() {
        return "";
    }

    get _seed() {
        return "";
    }

    __sign__(message, nhashtype = Signature.SIGHASH_ALL) {
        let messageBuffer = Buffer.from(message, "hex");
        let signature = ECDSA.sign(messageBuffer, this.wallet, "big").set({
            nhashtype,
        });

        return signature.toTxFormat().toString("hex");
    }

    sign(data) {
        if (Array.isArray(data)) {
            let signature = [];
            for (let message of data) {
                signature.push(this.__sign__(message));
            }

            return signature;
        } else {
            return this.__sign__(data);
        }
    }

    export() {
        return {
            chain: this.identifier.chain,
            currency: this.identifier.currency,
            privateKey: this.privateKey,
            publicKey: this.publicKey,
            address: this.address,
            mnemonic: this._mnemonic,

            network: this.network,
            language: this.language,
            passphrase: this.passphrase,
            seed: this._seed,
            walletType: this.walletType,
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
        this.wallet = new Bitcore.PrivateKey(options.privateKey, this.network);
    }
}

class MnemonicWallet extends BaseWallet {
    constructor(options) {
        super(options);
        this.instance = BaseWallet.getMnemonic({
            language: this.language,
            mnemonic: this.mnemonic,
        });
        this.HDPrivateKey = this.instance.toHDPrivateKey(this.passphrase, this.network, this.path);
        this.wallet = this.HDPrivateKey.privateKey;
    }

    get _mnemonic() {
        return this.instance.phrase;
    }

    get _seed() {
        return this.instance.toSeed().toString("hex");
    }
}


class Wallet {
    // import private key with type = P2PKH or P2SH, default P2PKH
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

    static publicToAddress({publicKey, network, walletType = 'P2PKH'}) {
        network = network || DEFAULT_NETWORK;
        if (!_NETWORKS[network]) {
            throw new TypeError('network must be "livenet" or "testnet".');
        }
        publicKey = new Bitcore.PublicKey(publicKey, {network});

        if (walletType === WALLET_TYPE.P2SH) {

            network = _NETWORKS[network];
            const pubkey = publicKey.toBuffer();
            let p2sh = __p2sh__({redeem: __p2wpkh__({pubkey, network}), network});
            return p2sh.address;
        }
        return publicKey.toAddress(network).toString();
    }
}

module.exports = Wallet;
