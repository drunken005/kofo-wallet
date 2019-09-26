"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _require = require("ethers"),
    utils = _require.utils;

var DEFAULT_PATH = "m/44'/195'/0'/0/0";

var bip32 = require('bip32');

var Mnemonic = require('../btc/mnemonic/mnemonic');

var _require2 = require('./utils/code'),
    hexStr2byteArray = _require2.hexStr2byteArray,
    byteArray2hexStr = _require2.byteArray2hexStr;

var _require3 = require('./utils/crypto'),
    getAddressFromPriKey = _require3.getAddressFromPriKey,
    getBase58CheckAddress = _require3.getBase58CheckAddress,
    getPubKeyFromPriKey = _require3.getPubKeyFromPriKey,
    computeAddress = _require3.computeAddress;

var BaseWallet =
/*#__PURE__*/
function () {
  function BaseWallet(_ref) {
    var identifier = _ref.identifier,
        mnemonic = _ref.mnemonic,
        language = _ref.language,
        path = _ref.path;
    (0, _classCallCheck2["default"])(this, BaseWallet);
    this.identifier = identifier;
    this.path = path || DEFAULT_PATH; //More info on https://github.com/satoshilabs/slips/blob/master/slip-0044.md

    this.mnemonic = mnemonic;
    this.language = language || 'en';
  }

  (0, _createClass2["default"])(BaseWallet, [{
    key: "sign",
    value: function () {
      var _sign = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee(data) {
        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                console.info('Currency chain not supported');
                return _context.abrupt("return", '');

              case 2:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));

      function sign(_x) {
        return _sign.apply(this, arguments);
      }

      return sign;
    }()
  }, {
    key: "export",
    value: function _export() {
      var _export = this.identifier["export"]();

      return Object.assign(_export, {
        privateKey: this.privateKey,
        publicKey: this.publicKey,
        address: this.address,
        mnemonic: this._mnemonic,
        language: this.language,
        path: this.path,
        seed: this._seed
      });
    }
  }, {
    key: "privateKey",
    get: function get() {
      return this.wallet.privateKey;
    }
  }, {
    key: "publicKey",
    get: function get() {
      var pubKeyBytes = getPubKeyFromPriKey(this.wallet.priKeyBytes);
      return byteArray2hexStr(pubKeyBytes);
    }
  }, {
    key: "address",
    get: function get() {
      var addressBytes = getAddressFromPriKey(this.wallet.priKeyBytes);
      return getBase58CheckAddress(addressBytes);
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
    var privateKey = options.privateKey;
    var priKeyBytes = hexStr2byteArray(privateKey);
    _this.wallet = {
      privateKey: privateKey,
      priKeyBytes: priKeyBytes
    };
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

    var seed = _this2.instance.toSeed();

    var root = bip32.fromSeed(seed);
    var BIP32 = root.derivePath(_this2.path);
    var privateKey = BIP32.privateKey.toString('hex');
    var priKeyBytes = hexStr2byteArray(privateKey);
    _this2.wallet = {
      privateKey: privateKey,
      priKeyBytes: priKeyBytes
    };
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
    value: function importPrivateWallet(options) {
      if (!options.privateKey) {
        throw new Error("Invalid privateKey=".concat(options.privateKey));
      }

      return new PrivateWallet(options);
    }
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
      var publicKey = _ref2.publicKey;
      if (typeof publicKey !== 'string') throw new Error('The publicKey is not a string');
      var pubKeyBytes = hexStr2byteArray(publicKey);
      var addressBytes = computeAddress(pubKeyBytes); //hex
      //byteArray2hexStr(addressBytes)
      // base58

      return getBase58CheckAddress(addressBytes);
    }
  }]);
  return Wallet;
}();

module.exports = Wallet;