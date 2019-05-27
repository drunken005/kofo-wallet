const {Wallet: __wallet__, utils} = require("ethers");

class Wallet {
    constructor({identifier, privateKey}) {
        this.identifier = identifier;
        this.wallet = new __wallet__(privateKey);
    }

    async sign(data) {
        let tx = utils.parseTransaction(data);
        return await this.wallet.sign(tx);
    }

    export() {
        return {
            chain: this.identifier.chain,
            currency: this.identifier.currency,
            privateKey: this.wallet.privateKey,
            publicKey: this.wallet.signingKey.publicKey,
            address: this.wallet.address
        };
    }

    static publicToAddress(publicKey) {
        return utils.computeAddress(publicKey);
    }
}

module.exports = Wallet;
