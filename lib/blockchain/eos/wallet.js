const ecc = require('eosjs-ecc');

class Wallet {
    constructor({identifier, privateKey}) {
        this.identifier = identifier;
        this.privateKey = privateKey;
    }

    sign(data) {
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
            privateKey: this.privateKey,
            publicKey: ecc.privateToPublic(this.privateKey),
            address: '',
            wif: ecc.seedPrivate(this.privateKey)
        };
    }

    static publicToAddress(publicKey) {
        return publicKey;
    }
}

module.exports = Wallet;