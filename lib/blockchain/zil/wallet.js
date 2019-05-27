const {Transaction} = require('@zilliqa-js/account');
const {BN, Long, units} = require('@zilliqa-js/util');
const {Zilliqa} = require('@zilliqa-js/zilliqa');
const CR = require('@zilliqa-js/crypto');
const _ = require('lodash');


class Wallet {
    constructor({identifier, privateKey}) {
        const zilliqa = new Zilliqa('');
        zilliqa.wallet.addByPrivateKey(
            privateKey
        );
        this.identifier = identifier;
        this.wallet = zilliqa.wallet;
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
            privateKey: this.wallet.defaultAccount.privateKey,
            publicKey: this.wallet.defaultAccount.publicKey,
            address: this.wallet.defaultAccount.address
        };
    }

    static publicToAddress(publicKey) {
        return CR.getAddressFromPublicKey(publicKey);
    }
}

module.exports = Wallet;