const {Transaction} = require('@zilliqa-js/account');
const {BN, Long, units} = require('@zilliqa-js/util');
const {Zilliqa} = require('@zilliqa-js/zilliqa');
const CR = require('@zilliqa-js/crypto');
const _ = require('lodash');


class BaseWallet {
    constructor({identifier, mnemonic, path}) {
        this.identifier = identifier;
        this.path = path || "m/44'/313'/0'/0/0"; //More info on https://github.com/satoshilabs/slips/blob/master/slip-0044.md
        this.mnemonic = mnemonic;
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

    async sign(data) {
        data = JSON.parse(data);
        data.pubKey = data.senderPubKey || this.wallet.defaultAccount.publicKey;
        data.amount = new BN(units.toQa((parseInt(data.amount) / 1000000000000).toString(), units.Units.Zil));
        data.gasLimit = Long.fromNumber(parseInt(data.gasLimit));
        data.gasPrice = units.toQa((parseInt(data.gasPrice) / 1000000).toString(), units.Units.Li);
        let tx = new Transaction(data, null);
        let si = await this.wallet.sign(tx);
        let signed = _.omit(si.txParams, 'receipt');
        signed.gasLimit = signed.gasLimit.toString();
        signed.gasPrice = signed.gasPrice.toString();
        signed.amount = signed.amount.toString();
        signed.senderPubKey = data.pubKey;
        return JSON.stringify(signed)
    }

    export() {
        return {
            chain: this.identifier.chain,
            currency: this.identifier.currency,
            privateKey: this.privateKey,
            publicKey: this.publicKey,
            address: this.address,
            mnemonic: this._mnemonic,
            path: this.path
        };
    }
}

class PrivateWallet extends BaseWallet {
    constructor(options) {
        super(options);
        const zilliqa = new Zilliqa('');
        zilliqa.wallet.addByPrivateKey(options.privateKey);
        this.wallet = zilliqa.wallet;
    }
}

class MnemonicWallet extends BaseWallet {
    constructor(options) {
        super(options);
        throw new Error('Unimplemented')
    }

    get _mnemonic() {
        return '';
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
        throw new Error('Unimplemented')
    }

    static publicToAddress({publicKey}) {
        return CR.getAddressFromPublicKey(publicKey);
    }
}

module.exports = Wallet;