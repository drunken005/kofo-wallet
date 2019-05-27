const wallets = require('./blockchain/wallet');
const Identifier = require('./identifier');
const DEFAULT_NETWORK = 'livenet';

class KofoWallet {
    constructor(chain, currency, privateKey, network = DEFAULT_NETWORK) {
        if (chain && currency && privateKey) {
            let identifier = new Identifier(chain, currency);
            let wallet = wallets[identifier.chain];
            if (!wallet) {
                throw new Error(`Invalid wallet instance with wallets.${identifier.chain}`)
            }
            this[chain] = new wallet({identifier, privateKey, network});
        }
    }

    importPrivateKey(chain, currency, privateKey, network = DEFAULT_NETWORK) {
        let identifier = new Identifier(chain, currency);
        let wallet = wallets[identifier.chain];
        if (!wallet) {
            throw new Error(`Invalid wallet instance with wallets.${identifier.chain}`)
        }
        this[chain] = new wallet({identifier, privateKey, network});
    }

    static publicToAddress(chain, currency, publicKey, network = DEFAULT_NETWORK) {
        let identifier = new Identifier(chain, currency);
        let wallet = wallets[identifier.chain];
        if (!wallet) {
            throw new Error(`Invalid wallet instance with wallets.${identifier.chain}`)
        }
        return wallet.publicToAddress(publicKey, network)
    }
}

module.exports = KofoWallet;