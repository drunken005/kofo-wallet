const Bitcore = require("bitcore-lib");
const ECDSA = Bitcore.crypto.ECDSA;
const Signature = Bitcore.crypto.Signature;
const DEFAULT_NETWORK = 'livenet';

class Wallet {
    constructor({identifier, privateKey, network = DEFAULT_NETWORK}) {
        this.identifier = identifier;
        this.wallet = new Bitcore.PrivateKey(privateKey, network);
        this.network = network;
    }

    _sign(message, nhashtype = Signature.SIGHASH_ALL) {
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
                signature.push(this._sign(message));
            }
            return signature;
        } else {
            return this._sign(data);
        }
    }

    export() {
        return {
            chain: this.identifier.chain,
            currency: this.identifier.currency,
            privateKey: this.wallet.toString(),
            publicKey: this.wallet.publicKey.toString(),
            address: this.wallet.toAddress().toString(),
            network: this.network,
            wif: this.wallet.toWIF()
        };
    }

    static publicToAddress(publicKey, network) {
        let publicKeyObject = Bitcore.PublicKey.fromString(publicKey);
        let address = publicKeyObject.toAddress(network);
        return address.toString();
    }
}

module.exports = Wallet;