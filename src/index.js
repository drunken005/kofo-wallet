const wallets = require('./chain/wallet');
const Identifier = require('./identifier');
const Mnemonic = require("./chain/btc/mnemonic/mnemonic");
const _ = require('lodash');

/**
 * Generated wallet instance by mnemonic, private key, keystore
 * Support for rawTransaction signatures on blockchain
 */
class KofoWallet {

  /**
   * Print the current wallet support chain
   * @returns {string}
   */
  static get supportsChain() {
    return `kofo wallet supports chain:< ${_.keys(wallets).join(' ')} >`
  }

  /**
   * Get the chain identifier
   * @param chain  Chain name e.g ETH
   * @param currency  Currency name e.g ETH
   * @returns {{identifier: Identifier, instance: *}}
   */
  static getIdentifier(chain, currency) {
    let identifier = new Identifier(chain, currency);
    let instance = wallets[identifier.chain];
    if (!instance) {
      throw new Error(`Invalid wallet instance with ${identifier.toString()}`);
    }
    return {instance, identifier};
  }

  /**
   * Create all support chain wallets at once
   * @param network [Optional] BTC network only, default "livenet"
   * @param walletType [Optional] BTC network only，default 'P2PKH', supports "P2PKH" and "P2SH"
   * @returns {MnemonicWallet}
   */
  static createWallets(network, walletType) {
    let mnemonic = Mnemonic.getMnemonic('en').phrase;
    let _wallets = {};
    _.keys(wallets).forEach((chain) => {
      let {instance, identifier} = KofoWallet.getIdentifier(chain, chain);
      _wallets[chain] = instance.importMnemonicWallet({identifier, mnemonic, network, walletType});
    });
    return _wallets;
  }

  /**
   * Specify blockchain to create an HDWallet using mnemonic
   * @param chain  Chain name e.g ETH
   * @param currency  Currency name e.g ETH
   * @param network  [Optional] BTC network only, default "livenet"
   * @param language  [Optional] Mnemonic language，default "en" english, supports [ENGLISH 'en', SPANISH 'es', JAPANESE 'ja', CHINESE 'zh', FRENCH 'fr', ITALIAN 'it']
   * @param walletType  [Optional] BTC network only，default 'P2PKH', supports "P2PKH" and "P2SH", more info on https://en.bitcoin.it/wiki/Address
   * @param path  [Optional] Mnemonic derive path, each chain has a different path and default path value, more info on https://github.com/bitcoin/bips/blob/master/bip-0044.mediawiki
   * @returns {MnemonicWallet}
   */
  static createWallet({chain, currency, network, language, walletType, path}) {
    let {instance, identifier} = KofoWallet.getIdentifier(chain, currency);
    return instance.createWallet({identifier, network, language, walletType, path});
  }


  /**
   * Import the wallet with the private key
   * @param chain  Chain name e.g ETH
   * @param currency  Currency name e.g ETH
   * @param privateKey  Wallet private key
   * @param walletType  [Optional] BTC network only，default 'P2PKH', default 'P2PKH', supports "P2PKH" and "P2SH", more info on https://en.bitcoin.it/wiki/Address
   * @param network  [Optional] BTC network only, default "livenet"
   * @returns {PrivateWallet}
   */
  static importPrivateWallet({chain, currency, privateKey, walletType, network}) {
    let {instance, identifier} = KofoWallet.getIdentifier(chain, currency);
    return instance.importPrivateWallet({identifier, privateKey, walletType, network});
  }

  /**
   * Import mnemonic word HDWallet
   * @param chain Chain name e.g ETH
   * @param currency Currency name e.g ETH
   * @param mnemonic The mnemonic string
   * @param language  [Optional] Mnemonic language，default "en" english,
   * @param walletType  [Optional] BTC network only，default 'P2PKH', supports "P2PKH" and "P2SH"
   * @param path  [Optional] Mnemonic derive path
   * @param network [Optional] BTC network only, default "livenet"
   * @returns {MnemonicWallet}
   */
  static importMnemonicWallet({chain, currency, mnemonic, language, walletType, path, network}) {
    let {instance, identifier} = KofoWallet.getIdentifier(chain, currency);
    return instance.importMnemonicWallet({identifier, mnemonic, language, walletType, path, network});
  }


  /**
   * Import the keystore encrypted file wallet, currently only ETH are supported
   * @param chain Chain name e.g ETH
   * @param currency Currency name e.g ETH
   * @param keystore Keystore JSON
   * @param password Keystore passphrase
   * @param network HPB network only, default is `"livenet"`.
   * @returns {Promise<*|void|*>}
   */
  static async importKeyStoreWallet({chain, currency, keystore, password, network}) {
    let {instance, identifier} = KofoWallet.getIdentifier(chain, currency);
    return await instance.importKeyStoreWallet({identifier, keystore, password, network});
  }

  /**
   * Takes public key hex-encoded string and returns the corresponding address
   * @param chain  Chain name e.g ETH
   * @param currency  Currency name e.g ETH
   * @param publicKey  Public key string
   * @param network  [Optional] BTC network only, default "livenet"
   * @param walletType  [Optional] BTC network only，default 'P2PKH'
   * @returns {*}
   */
  static publicToAddress({chain, currency, publicKey, network, walletType}) {
    let {instance} = KofoWallet.getIdentifier(chain, currency);
    return instance.publicToAddress({publicKey, network, walletType})
  }
}

module.exports = KofoWallet;