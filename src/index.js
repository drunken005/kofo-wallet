const wallets = require('./blockchain/wallet');
const Identifier = require('./identifier');

class KofoWallet {

    static getIdentifier(chain, currency) {
        let identifier = new Identifier(chain, currency);
        let instance = wallets[identifier.chain];
        if (!instance) {
            throw new Error(`Invalid wallet instance with ${identifier.toString()}`);
        }
        return {instance, identifier};
    }

    static createWallet({chain, currency, network, passphrase, language, walletType, path}) {
        let {instance, identifier} = KofoWallet.getIdentifier(chain, currency);
        return instance.createWallet({identifier, network, passphrase, language, walletType, path});
    }


    static importPrivateWallet({chain, currency, privateKey, walletType, path, network}) {
        let {instance, identifier} = KofoWallet.getIdentifier(chain, currency);
        return instance.importPrivateWallet({identifier, privateKey, walletType, path, network});
    }


    static importMnemonicWallet({chain, currency, mnemonic, passphrase, language, walletType, path, network}) {
        let {instance, identifier} = KofoWallet.getIdentifier(chain, currency);
        return instance.importMnemonicWallet({identifier, mnemonic, passphrase, language, walletType, path, network});
    }


    static async importKeyStoreWallet({chain, currency, data, password}) {
        let {instance, identifier} = KofoWallet.getIdentifier(chain, currency);
        return await instance.importKeyStoreWallet({identifier, data, password});
    }

    static publicToAddress({chain, currency, publicKey, network, walletType}) {
        let {instance} = KofoWallet.getIdentifier(chain, currency);
        return instance.publicToAddress({publicKey, network, walletType})
    }
}

module.exports = KofoWallet;
// (function () {
//     if (!window.KofoWallet) {
//         window.KofoWallet = KofoWallet;
//     }
// })();


