const {Transaction} = require('@zilliqa-js/account');
const {BN, Long, units} = require('@zilliqa-js/util');
const {Zilliqa} = require('@zilliqa-js/zilliqa');
const CR = require('@zilliqa-js/crypto');
const _ = require('lodash');
const Mnemonic = require('../btc/mnemonic/mnemonic');
const DEFAULT_PATH = "m/44'/313'/0'/0/0";
const Base58 = require('../trx/utils/base58');


class BaseWallet {
    constructor({identifier, mnemonic, language, path}) {
        this.identifier = identifier;
        this.pathIndex = path;
        this.path = path || DEFAULT_PATH; //More info on https://github.com/satoshilabs/slips/blob/master/slip-0044.md
        this.mnemonic = mnemonic;
        this.language = language || 'en';
        this.wallet = new Zilliqa('').wallet;
    }

    get privateKey() {
        return this.wallet.defaultAccount.privateKey;
    }

    get publicKey() {
        return this.wallet.defaultAccount.publicKey;
    }

    get address() {
        return this.wallet.defaultAccount.address;
    }

    get _mnemonic() {
        return "";
    }

    get _seed() {
        return '';
    }

    async sign(transaction) {
        if (_.isString(transaction)) {
            transaction = JSON.parse(transaction);
        }
        transaction.pubKey = transaction.senderPubKey || this.wallet.defaultAccount.publicKey;
        transaction.amount = new BN(units.toQa((parseInt(transaction.amount) / 1000000000000).toString(), units.Units.Zil));
        transaction.gasLimit = Long.fromNumber(parseInt(transaction.gasLimit));
        transaction.gasPrice = units.toQa((parseInt(transaction.gasPrice) / 1000000).toString(), units.Units.Li);
        transaction.data = transaction.data && _.isString(transaction.data) ? Buffer.from(Base58.decode58(transaction.data)).toString() : '';
        let tx = new Transaction(transaction, null);
        let si = await this.wallet.sign(tx);
        let signed = _.omit(si.txParams, 'receipt');
        signed.gasLimit = signed.gasLimit.toString();
        signed.gasPrice = signed.gasPrice.toString();
        signed.amount = signed.amount.toString();
        signed.senderPubKey = transaction.pubKey;
        return JSON.stringify(signed)
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
            seed: this._seed
        });
    }

    //Exports the specified account as a keystore file.
    async exportKeyStore(password) {
        return await this.wallet.export(this.address, password);
    }
}

class PrivateWallet extends BaseWallet {
    constructor(options) {
        super(options);
        this.wallet.addByPrivateKey(options.privateKey);
    }
}

class MnemonicWallet extends BaseWallet {
    constructor(options) {
        super(options);
        this.instance = Mnemonic.getMnemonic(this.language, this.mnemonic);
        this.wallet.addByMnemonic(this.instance.phrase, this.pathIndex);
    }

    get _mnemonic() {
        return this.instance.phrase;
    }

    get _seed() {
        return this.instance.toSeed().toString("hex");
    }
}

class KeystoreWallet extends BaseWallet {
    constructor(options) {
        super(options);
        this.keystore = options.keystore;
        this.password = options.password;
    }

    async importKeyStoreWallet() {
        await this.wallet.addByKeystore(this.keystore, this.password);
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
        let wallet = new KeystoreWallet({identifier, keystore, password});
        await wallet.importKeyStoreWallet();
        return wallet;
    }

    static publicToAddress({publicKey}) {
        return CR.getAddressFromPublicKey(publicKey);
    }
}

module.exports = Wallet;