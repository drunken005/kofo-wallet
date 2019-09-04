const Bitcore = require('bitcore-lib');
const Bitcoin = require('bitcoinjs-lib');
const Mnemonic = require("./mnemonic/mnemonic");
const ECDSA = Bitcore.crypto.ECDSA;
const Signature = Bitcore.crypto.Signature;
const DEFAULT_NETWORK = 'livenet';
const {p2sh: __p2sh__, p2wpkh: __p2wpkh__} = Bitcoin.payments;


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

const WALLET_PATH = {
    mainnet: {
        P2PKH: "m/44'/0'/0'/0/0",
        P2SH: "m/49'/0'/0'/0/0"
    },
    livenet: {
        P2PKH: "m/44'/0'/0'/0/0",
        P2SH: "m/49'/0'/0'/0/0"
    },
    testnet: {
        P2PKH: "m/44'/1'/0'/0/0",
        P2SH: "m/49'/1'/0'/0/0"
    }
};

/**
 *
 */
class BaseWallet {
    constructor({identifier, mnemonic, network, language, walletType, path}) {
        this.identifier = identifier;
        this.mnemonic = mnemonic;
        this.network = network || DEFAULT_NETWORK;
        if (!WALLET_PATH[this.network]) {
            throw new TypeError('network must be "livenet" or "testnet".');
        }
        this.language = language || 'en';
        this.walletType = walletType || WALLET_TYPE.P2PKH;
        if (!WALLET_TYPE[this.walletType]) {
            throw new Error(`Invalid wallet type=${this.walletType}`);
        }
        this.path = path || WALLET_PATH[this.network][this.walletType]//DEFAULT_WALLET_PATH[this.walletType];
    }

    get privateKey() {
        //hex private key: this.wallet.toBuffer().toString('hex')
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
            walletType: this.walletType
        });
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
        this.instance = Mnemonic.getMnemonic(this.language, this.mnemonic);
        this.HDPrivateKey = this.instance.toHDPrivateKey(this.network, this.path);
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
