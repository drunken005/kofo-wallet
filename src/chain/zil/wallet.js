"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _require = require('@zilliqa-js/account'),
    Transaction = _require.Transaction;

var _require2 = require('@zilliqa-js/util'),
    BN = _require2.BN,
    Long = _require2.Long,
    units = _require2.units,
    validation = _require2.validation;

var _require3 = require('@zilliqa-js/zilliqa'),
    Zilliqa = _require3.Zilliqa;

var CR = require('@zilliqa-js/crypto');

var _ = require('lodash');

var Mnemonic = require('../btc/mnemonic/mnemonic');

var DEFAULT_PATH = "m/44'/313'/0'/0/0";

var Base58 = require('../trx/utils/base58');

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
    this.pathIndex = path;
    this.path = path || DEFAULT_PATH; //More info on https://github.com/satoshilabs/slips/blob/master/slip-0044.md

    this.mnemonic = mnemonic;
    this.language = language || 'en';
    this.wallet = new Zilliqa('').wallet;
  }

  (0, _createClass2["default"])(BaseWallet, [{
    key: "sign",
    value: function () {
      var _sign = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee(transaction) {
        var tx, si, signed;
        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (_.isString(transaction)) {
                  transaction = JSON.parse(transaction);
                }

                transaction.pubKey = transaction.senderPubKey || this.wallet.defaultAccount.publicKey;
                transaction.amount = new BN(units.toQa((parseInt(transaction.amount) / 1000000000000).toString(), units.Units.Zil));
                transaction.gasLimit = Long.fromNumber(parseInt(transaction.gasLimit));
                transaction.gasPrice = units.toQa((parseInt(transaction.gasPrice) / 1000000).toString(), units.Units.Li);
                transaction.data = transaction.data && _.isString(transaction.data) ? Buffer.from(Base58.decode58(transaction.data)).toString() : '';
                tx = new Transaction(transaction, null);
                _context.next = 9;
                return this.wallet.sign(tx);

              case 9:
                si = _context.sent;
                signed = _.omit(si.txParams, 'receipt');
                signed.gasLimit = signed.gasLimit.toString();
                signed.gasPrice = signed.gasPrice.toString();
                signed.amount = signed.amount.toString();
                signed.senderPubKey = transaction.pubKey;
                return _context.abrupt("return", JSON.stringify(signed));

              case 16:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
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
    } //Exports the specified account as a keystore file.

  }, {
    key: "exportKeyStore",
    value: function () {
      var _exportKeyStore = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee2(password) {
        return _regenerator["default"].wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.next = 2;
                return this.wallet["export"](this.address, password);

              case 2:
                return _context2.abrupt("return", _context2.sent);

              case 3:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function exportKeyStore(_x2) {
        return _exportKeyStore.apply(this, arguments);
      }

      return exportKeyStore;
    }()
  }, {
    key: "privateKey",
    get: function get() {
      return this.wallet.defaultAccount.privateKey;
    }
  }, {
    key: "publicKey",
    get: function get() {
      return this.wallet.defaultAccount.publicKey;
    }
  }, {
    key: "address",
    get: function get() {
      return this.wallet.defaultAccount.address;
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
    var isPrivateKey = validation.isPrivateKey(options.privateKey);

    if (!isPrivateKey) {
      throw new Error('Private key format error.');
    }

    _this.wallet.addByPrivateKey(options.privateKey);

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

    _this2.wallet.addByMnemonic(_this2.instance.phrase, _this2.pathIndex);

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

var KeystoreWallet =
/*#__PURE__*/
function (_BaseWallet3) {
  (0, _inherits2["default"])(KeystoreWallet, _BaseWallet3);

  function KeystoreWallet(options) {
    var _this3;

    (0, _classCallCheck2["default"])(this, KeystoreWallet);
    _this3 = (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(KeystoreWallet).call(this, options));
    _this3.keystore = options.keystore;
    _this3.password = options.password;
    return _this3;
  }

  (0, _createClass2["default"])(KeystoreWallet, [{
    key: "importKeyStoreWallet",
    value: function () {
      var _importKeyStoreWallet = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee3() {
        return _regenerator["default"].wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.next = 2;
                return this.wallet.addByKeystore(this.keystore, this.password);

              case 2:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function importKeyStoreWallet() {
        return _importKeyStoreWallet.apply(this, arguments);
      }

      return importKeyStoreWallet;
    }()
  }]);
  return KeystoreWallet;
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
    key: "importKeyStoreWallet",
    value: function () {
      var _importKeyStoreWallet2 = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee4(_ref2) {
        var identifier, keystore, password, wallet;
        return _regenerator["default"].wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                identifier = _ref2.identifier, keystore = _ref2.keystore, password = _ref2.password;
                wallet = new KeystoreWallet({
                  identifier: identifier,
                  keystore: keystore,
                  password: password
                });
                _context4.next = 4;
                return wallet.importKeyStoreWallet();

              case 4:
                return _context4.abrupt("return", wallet);

              case 5:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4);
      }));

      function importKeyStoreWallet(_x3) {
        return _importKeyStoreWallet2.apply(this, arguments);
      }

      return importKeyStoreWallet;
    }()
  }, {
    key: "publicToAddress",
    value: function publicToAddress(_ref3) {
      var publicKey = _ref3.publicKey;

      if (!validation.isPubKey(publicKey)) {
        throw new Error('Public key format error.');
      }

      return CR.getAddressFromPublicKey(publicKey);
    }
  }]);
  return Wallet;
}();

module.exports = Wallet;