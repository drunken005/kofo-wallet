"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var Bitcore = require('bitcore-lib');

var Bitcoin = require('bitcoinjs-lib');

var Mnemonic = require("./mnemonic/mnemonic");

var ECDSA = Bitcore.crypto.ECDSA;
var Signature = Bitcore.crypto.Signature;
var DEFAULT_NETWORK = 'livenet';
var _Bitcoin$payments = Bitcoin.payments,
    __p2sh__ = _Bitcoin$payments.p2sh,
    __p2wpkh__ = _Bitcoin$payments.p2wpkh;

var _ = require('lodash');

var _NETWORKS = {
  'livenet': Bitcoin.networks.bitcoin,
  'mainnet': Bitcoin.networks.bitcoin,
  'testnet': Bitcoin.networks.testnet
};
/**
 * More info on https://en.bitcoin.it/wiki/Address
 * @type {{P2SH: string, P2PKH: string}}
 */

var WALLET_TYPE = {
  P2PKH: 'P2PKH',
  //P2PKH which begin with the number 1
  P2SH: 'P2SH' //P2SH type starting with the number 3

};
/**
 * More info on https://github.com/bitcoin/bips/blob/master/bip-0044.mediawiki
 * @type {{P2SH: string, P2PKH: string}}
 */

var WALLET_PATH = {
  mainnet: {
    P2PKH: "m/44'/0'/0'/0/0",
    P2SH: "m/49'/0'/0'/0/0"
  },
  livenet: {
    P2PKH: "m/44'/0'/0'/0/0",
    P2SH: "m/49'/0'/0'/0/0"
  },
  testnet: {
    P2PKH: "m/44'/1'/0'/0/0",
    P2SH: "m/49'/1'/0'/0/0"
  }
};
/**
 *
 */

var BaseWallet =
/*#__PURE__*/
function () {
  function BaseWallet(_ref) {
    var identifier = _ref.identifier,
        mnemonic = _ref.mnemonic,
        network = _ref.network,
        language = _ref.language,
        walletType = _ref.walletType,
        path = _ref.path;
    (0, _classCallCheck2["default"])(this, BaseWallet);
    this.identifier = identifier;
    this.mnemonic = mnemonic;
    this.network = network || DEFAULT_NETWORK;

    if (!WALLET_PATH[this.network]) {
      throw new TypeError('network must be "livenet" or "testnet".');
    }

    this.language = language || 'en';
    this.walletType = walletType || WALLET_TYPE.P2PKH;

    if (!WALLET_TYPE[this.walletType]) {
      throw new Error("Invalid wallet type=".concat(this.walletType));
    }

    this.path = path || WALLET_PATH[this.network][this.walletType]; //DEFAULT_WALLET_PATH[this.walletType];
  }

  (0, _createClass2["default"])(BaseWallet, [{
    key: "__sign__",
    value: function __sign__(message) {
      var nhashtype = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : Signature.SIGHASH_ALL;
      var messageBuffer = Buffer.from(message, "hex");
      var signature = ECDSA.sign(messageBuffer, this.wallet, "big").set({
        nhashtype: nhashtype
      });
      return signature.toTxFormat().toString("hex");
    }
  }, {
    key: "sign",
    value: function sign(data) {
      if (Array.isArray(data)) {
        var signature = [];
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = data[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var message = _step.value;
            signature.push(this.__sign__(message));
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator["return"] != null) {
              _iterator["return"]();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }

        return signature;
      } else {
        return this.__sign__(data);
      }
    }
  }, {
    key: "export",
    value: function _export() {
      var _export = this.identifier["export"]();

      return Object.assign(_export, {
        privateKey: this.privateKey,
        publicKey: this.publicKey,
        address: this.address,
        network: this.network,
        mnemonic: this._mnemonic,
        language: this.language,
        path: this.path,
        seed: this._seed,
        walletType: this.walletType
      });
    }
  }, {
    key: "privateKey",
    get: function get() {
      //hex private key: this.wallet.toBuffer().toString('hex')
      return this.wallet.toWIF();
    }
  }, {
    key: "publicKey",
    get: function get() {
      return this.wallet.publicKey.toString();
    }
  }, {
    key: "address",
    get: function get() {
      return Wallet.publicToAddress({
        publicKey: this.wallet.publicKey,
        network: this.network,
        walletType: this.walletType
      });
    }
  }, {
    key: "_mnemonic",
    get: function get() {
      return "";
    }
  }, {
    key: "_seed",
    get: function get() {
      return "";
    }
  }], [{
    key: "checktPrivateKey",
    value: function checktPrivateKey(privateKey, network) {
      if (!privateKey || !_.isString(privateKey)) {
        throw new Error('Private key format error.');
      }

      var klength = privateKey.length;

      if (!(klength === 52 || klength === 64) || !Bitcore.PrivateKey.isValid(privateKey, network)) {
        throw new Error('Private key format error.');
      }
    }
  }]);
  return BaseWallet;
}();

var PrivateWallet =
/*#__PURE__*/
function (_BaseWallet) {
  (0, _inherits2["default"])(PrivateWallet, _BaseWallet);

  function PrivateWallet(options) {
    var _this;

    (0, _classCallCheck2["default"])(this, PrivateWallet);
    _this = (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(PrivateWallet).call(this, options));
    BaseWallet.checktPrivateKey(options.privateKey, _this.network);

    try {
      _this.wallet = new Bitcore.PrivateKey(options.privateKey, _this.network);
    } catch (e) {
      throw new Error('Private key format error.');
    }

    return _this;
  }

  return PrivateWallet;
}(BaseWallet);

var MnemonicWallet =
/*#__PURE__*/
function (_BaseWallet2) {
  (0, _inherits2["default"])(MnemonicWallet, _BaseWallet2);

  function MnemonicWallet(options) {
    var _this2;

    (0, _classCallCheck2["default"])(this, MnemonicWallet);
    _this2 = (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(MnemonicWallet).call(this, options));
    _this2.instance = Mnemonic.getMnemonic(_this2.language, _this2.mnemonic);
    _this2.HDPrivateKey = _this2.instance.toHDPrivateKey(_this2.network, _this2.path);
    _this2.wallet = _this2.HDPrivateKey.privateKey;
    return _this2;
  }

  (0, _createClass2["default"])(MnemonicWallet, [{
    key: "_mnemonic",
    get: function get() {
      return this.instance.phrase;
    }
  }, {
    key: "_seed",
    get: function get() {
      return this.instance.toSeed().toString("hex");
    }
  }]);
  return MnemonicWallet;
}(BaseWallet);

var Wallet =
/*#__PURE__*/
function () {
  function Wallet() {
    (0, _classCallCheck2["default"])(this, Wallet);
  }

  (0, _createClass2["default"])(Wallet, null, [{
    key: "importPrivateWallet",
    // import private key with type = P2PKH or P2SH, default P2PKH
    value: function importPrivateWallet(options) {
      if (!options.privateKey) {
        throw new Error("Invalid privateKey=".concat(options.privateKey));
      }

      return new PrivateWallet(options);
    }
    /**
     *
     * @param options
     * @returns {MnemonicWallet}
     */

  }, {
    key: "createWallet",
    value: function createWallet(options) {
      return new MnemonicWallet(options);
    }
  }, {
    key: "importMnemonicWallet",
    value: function importMnemonicWallet(options) {
      if (!options.mnemonic) {
        throw new Error("Invalid mnemonic=".concat(options.mnemonic));
      }

      return new MnemonicWallet(options);
    }
  }, {
    key: "publicToAddress",
    value: function publicToAddress(_ref2) {
      var publicKey = _ref2.publicKey,
          network = _ref2.network,
          _ref2$walletType = _ref2.walletType,
          walletType = _ref2$walletType === void 0 ? 'P2PKH' : _ref2$walletType;
      network = network || DEFAULT_NETWORK;

      if (!_NETWORKS[network]) {
        throw new TypeError('network must be "livenet" or "testnet".');
      }

      publicKey = new Bitcore.PublicKey(publicKey, {
        network: network
      });

      if (walletType === WALLET_TYPE.P2SH) {
        network = _NETWORKS[network];
        var pubkey = publicKey.toBuffer();

        var p2sh = __p2sh__({
          redeem: __p2wpkh__({
            pubkey: pubkey,
            network: network
          }),
          network: network
        });

        return p2sh.address;
      }

      return publicKey.toAddress(network).toString();
    }
  }]);
  return Wallet;
}();

module.exports = Wallet;