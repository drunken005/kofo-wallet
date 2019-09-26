"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var BnbUtils = require('binance-utils');

var NETWORK_PREFIX_MAPPING = {
  "testnet": "tbnb",
  "mainnet": "bnb"
};
var NERWORK = {
  "testnet": "testnet",
  "livenet": "mainnet",
  "mainnet": "mainnet"
};
var HDPATH = "44'/714'/0'/0/0";

var BaseWallet =
/*#__PURE__*/
function () {
  function BaseWallet(_ref) {
    var identifier = _ref.identifier,
        mnemonic = _ref.mnemonic,
        network = _ref.network,
        language = _ref.language,
        path = _ref.path;
    (0, _classCallCheck2["default"])(this, BaseWallet);
    this.identifier = identifier;
    this.mnemonic = mnemonic;
    network = network || NERWORK.livenet;
    this.network = NERWORK[network];
    this.language = language || 'en';
    this.path = path || HDPATH;
  }

  (0, _createClass2["default"])(BaseWallet, [{
    key: "sign",
    value: function sign(data) {
      return this.wallet.sign(data);
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
        seed: this._seed
      });
    }
  }, {
    key: "exportKeyStore",
    value: function exportKeyStore(password) {
      return this.wallet.exportKeystore(password);
    }
  }, {
    key: "privateKey",
    get: function get() {
      return this.wallet.privateKey;
    }
  }, {
    key: "publicKey",
    get: function get() {
      return this.wallet.publicKey;
    }
  }, {
    key: "address",
    get: function get() {
      return this.wallet.address;
    }
  }, {
    key: "_mnemonic",
    get: function get() {
      return "";
    }
  }, {
    key: "_seed",
    get: function get() {
      return '';
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
    _this.wallet = new BnbUtils.Wallet(options.privateKey, _this.network);
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
    _this2.wallet = BnbUtils.Wallet.createMnemonicWallet(_this2.mnemonic, _this2.network);
    return _this2;
  }

  (0, _createClass2["default"])(MnemonicWallet, [{
    key: "_mnemonic",
    get: function get() {
      return this.wallet.mnemonic;
    }
  }, {
    key: "_seed",
    get: function get() {
      return this.wallet.seed;
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
    key: "importKeyStoreWallet",
    value: function importKeyStoreWallet(_ref2) {
      var identifier = _ref2.identifier,
          keystore = _ref2.keystore,
          password = _ref2.password,
          network = _ref2.network;
      var privateKey = BnbUtils.crypto.getPrivateKeyFromKeyStore(keystore, password);
      return new PrivateWallet({
        identifier: identifier,
        network: network,
        privateKey: privateKey
      });
    }
  }, {
    key: "publicToAddress",
    value: function publicToAddress(_ref3) {
      var publicKey = _ref3.publicKey,
          network = _ref3.network;
      network = network || NERWORK.livenet;

      if (!NERWORK[network]) {
        throw new TypeError('network must be "livenet" or "testnet".');
      }

      network = NERWORK[network];
      return BnbUtils.crypto.getAddressFromPublicKey(publicKey, NETWORK_PREFIX_MAPPING[network]);
    }
  }]);
  return Wallet;
}();

module.exports = Wallet;