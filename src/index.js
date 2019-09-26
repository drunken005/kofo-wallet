"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var wallets = require('./chain/wallet');

var Identifier = require('./identifier');

var Mnemonic = require("./chain/btc/mnemonic/mnemonic");

var _ = require('lodash');
/**
 * Generated wallet instance by mnemonic, private key, keystore
 * Support for rawTransaction signatures on chain
 */


var KofoWallet =
/*#__PURE__*/
function () {
  function KofoWallet() {
    (0, _classCallCheck2["default"])(this, KofoWallet);
  }

  (0, _createClass2["default"])(KofoWallet, null, [{
    key: "getIdentifier",

    /**
     * Get the chain identifier
     * @param chain  Chain name e.g ETH
     * @param currency  Currency name e.g ETH
     * @returns {{identifier: Identifier, instance: *}}
     */
    value: function getIdentifier(chain, currency) {
      var identifier = new Identifier(chain, currency);
      var instance = wallets[identifier.chain];

      if (!instance) {
        throw new Error("Invalid wallet instance with ".concat(identifier.toString()));
      }

      return {
        instance: instance,
        identifier: identifier
      };
    }
    /**
     * Create all support chain wallets at once
     * @param network [Optional] BTC network only, default "livenet"
     * @param walletType [Optional] BTC network only，default 'P2PKH', supports "P2PKH" and "P2SH"
     * @returns {MnemonicWallet}
     */

  }, {
    key: "createWallets",
    value: function createWallets(network, walletType) {
      var mnemonic = Mnemonic.getMnemonic('en').phrase;
      var _wallets = {};

      _.keys(wallets).forEach(function (chain) {
        var _KofoWallet$getIdenti = KofoWallet.getIdentifier(chain, chain),
            instance = _KofoWallet$getIdenti.instance,
            identifier = _KofoWallet$getIdenti.identifier;

        _wallets[chain] = instance.importMnemonicWallet({
          identifier: identifier,
          mnemonic: mnemonic,
          network: network,
          walletType: walletType
        });
      });

      return _wallets;
    }
    /**
     * Specify chain to create an HDWallet using mnemonic
     * @param chain  Chain name e.g ETH
     * @param currency  Currency name e.g ETH
     * @param network  [Optional] BTC network only, default "livenet"
     * @param language  [Optional] Mnemonic language，default "en" english, supports [ENGLISH 'en', SPANISH 'es', JAPANESE 'ja', CHINESE 'zh', FRENCH 'fr', ITALIAN 'it']
     * @param walletType  [Optional] BTC network only，default 'P2PKH', supports "P2PKH" and "P2SH", more info on https://en.bitcoin.it/wiki/Address
     * @param path  [Optional] Mnemonic derive path, each chain has a different path and default path value, more info on https://github.com/bitcoin/bips/blob/master/bip-0044.mediawiki
     * @returns {MnemonicWallet}
     */

  }, {
    key: "createWallet",
    value: function createWallet(_ref) {
      var chain = _ref.chain,
          currency = _ref.currency,
          network = _ref.network,
          language = _ref.language,
          walletType = _ref.walletType,
          path = _ref.path;

      var _KofoWallet$getIdenti2 = KofoWallet.getIdentifier(chain, currency),
          instance = _KofoWallet$getIdenti2.instance,
          identifier = _KofoWallet$getIdenti2.identifier;

      return instance.createWallet({
        identifier: identifier,
        network: network,
        language: language,
        walletType: walletType,
        path: path
      });
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

  }, {
    key: "importPrivateWallet",
    value: function importPrivateWallet(_ref2) {
      var chain = _ref2.chain,
          currency = _ref2.currency,
          privateKey = _ref2.privateKey,
          walletType = _ref2.walletType,
          network = _ref2.network;

      var _KofoWallet$getIdenti3 = KofoWallet.getIdentifier(chain, currency),
          instance = _KofoWallet$getIdenti3.instance,
          identifier = _KofoWallet$getIdenti3.identifier;

      return instance.importPrivateWallet({
        identifier: identifier,
        privateKey: privateKey,
        walletType: walletType,
        network: network
      });
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

  }, {
    key: "importMnemonicWallet",
    value: function importMnemonicWallet(_ref3) {
      var chain = _ref3.chain,
          currency = _ref3.currency,
          mnemonic = _ref3.mnemonic,
          language = _ref3.language,
          walletType = _ref3.walletType,
          path = _ref3.path,
          network = _ref3.network;

      var _KofoWallet$getIdenti4 = KofoWallet.getIdentifier(chain, currency),
          instance = _KofoWallet$getIdenti4.instance,
          identifier = _KofoWallet$getIdenti4.identifier;

      return instance.importMnemonicWallet({
        identifier: identifier,
        mnemonic: mnemonic,
        language: language,
        walletType: walletType,
        path: path,
        network: network
      });
    }
    /**
     * Import the keystore encrypted file wallet, currently only ETH and ZIL are supported
     * @param chain Chain name e.g ETH
     * @param currency Currency name e.g ETH
     * @param keystore Keystore JSON
     * @param password Keystore passphrase
     * @param network HPB network only, default is `"livenet"`.
     * @returns {Promise<*|void|*>}
     */

  }, {
    key: "importKeyStoreWallet",
    value: function () {
      var _importKeyStoreWallet = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee(_ref4) {
        var chain, currency, keystore, password, network, _KofoWallet$getIdenti5, instance, identifier;

        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                chain = _ref4.chain, currency = _ref4.currency, keystore = _ref4.keystore, password = _ref4.password, network = _ref4.network;
                _KofoWallet$getIdenti5 = KofoWallet.getIdentifier(chain, currency), instance = _KofoWallet$getIdenti5.instance, identifier = _KofoWallet$getIdenti5.identifier;
                _context.next = 4;
                return instance.importKeyStoreWallet({
                  identifier: identifier,
                  keystore: keystore,
                  password: password,
                  network: network
                });

              case 4:
                return _context.abrupt("return", _context.sent);

              case 5:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));

      function importKeyStoreWallet(_x) {
        return _importKeyStoreWallet.apply(this, arguments);
      }

      return importKeyStoreWallet;
    }()
    /**
     * Takes public key hex-encoded string and returns the corresponding address
     * @param chain  Chain name e.g ETH
     * @param currency  Currency name e.g ETH
     * @param publicKey  Public key string
     * @param network  [Optional] BTC network only, default "livenet"
     * @param walletType  [Optional] BTC network only，default 'P2PKH'
     * @returns {*}
     */

  }, {
    key: "publicToAddress",
    value: function publicToAddress(_ref5) {
      var chain = _ref5.chain,
          currency = _ref5.currency,
          publicKey = _ref5.publicKey,
          network = _ref5.network,
          walletType = _ref5.walletType;

      var _KofoWallet$getIdenti6 = KofoWallet.getIdentifier(chain, currency),
          instance = _KofoWallet$getIdenti6.instance;

      return instance.publicToAddress({
        publicKey: publicKey,
        network: network,
        walletType: walletType
      });
    }
  }, {
    key: "supportsChain",

    /**
     * Print the current wallet support chain
     * @returns {string}
     */
    get: function get() {
      return "kofo wallet supports chain:< ".concat(_.keys(wallets).join(' '), " >");
    }
  }]);
  return KofoWallet;
}();

module.exports = KofoWallet;