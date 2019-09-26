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
    __wallet__ = _require.Wallet,
    utils = _require.utils;

var hpbUtils = require('./util');

var _ = require('lodash');

var COMMA_SYMBOL = ',';
var BLANK_SYMBOL = '';
var DEFAULT_NETWORK = 'livenet';
var chainId = {
  livenet: 269,
  testnet: 1
};
var DEFAULT_PATH = "m/44'/269'/0'/0/0";

var BaseWallet =
/*#__PURE__*/
function () {
  function BaseWallet(_ref) {
    var identifier = _ref.identifier,
        mnemonic = _ref.mnemonic,
        language = _ref.language,
        path = _ref.path,
        network = _ref.network;
    (0, _classCallCheck2["default"])(this, BaseWallet);
    this.identifier = identifier;
    this.path = path || DEFAULT_PATH; //More info on https://github.com/satoshilabs/slips/blob/master/slip-0044.md

    this.mnemonic = mnemonic;
    this.language = language || 'en';
    this.network = network || DEFAULT_NETWORK;

    if (!chainId[this.network]) {
      throw new TypeError('HPB network error,  must be "livenet" or "testnet", default is "livenet"');
    }
  }

  (0, _createClass2["default"])(BaseWallet, [{
    key: "sign",
    value: function () {
      var _sign = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee(data) {
        var self, _formatTransaction, transaction, isRawTx;

        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (data) {
                  _context.next = 2;
                  break;
                }

                throw new TypeError('Sign data is null');

              case 2:
                self = this;

                _formatTransaction = function _formatTransaction(transaction) {
                  _.each(transaction, function (value, key) {
                    if (['gasPrice', 'gasLimit', 'value'].indexOf(key) >= 0) {
                      var number = new Number(value);
                      value = number.toLocaleString().split(COMMA_SYMBOL).join(BLANK_SYMBOL);
                      transaction[key] = hpbUtils.handleNumber(value);
                    }

                    if (key === 'data' && value.indexOf('0x') !== 0) {
                      transaction[key] = '0x' + value;
                    }
                  });

                  return _.assign(transaction, {
                    chainId: chainId[self.network]
                  });
                };

                isRawTx = false;

                if (_.isString(data)) {
                  try {
                    transaction = JSON.parse(data);
                  } catch (e) {
                    isRawTx = true;
                    transaction = hpbUtils.parseTransaction(data);
                  }

                  transaction = !isRawTx ? _formatTransaction(transaction) : transaction;
                } else {
                  transaction = _formatTransaction(data);
                }

                if (transaction) {
                  _context.next = 8;
                  break;
                }

                throw new TypeError('Transaction is undefined.');

              case 8:
                _context.next = 10;
                return this.wallet.sign(transaction);

              case 10:
                return _context.abrupt("return", _context.sent);

              case 11:
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
        seed: this._seed,
        network: this.network
      });
    }
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
                return this.wallet.encrypt(password);

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
      return this.wallet.privateKey;
    }
  }, {
    key: "publicKey",
    get: function get() {
      return this.wallet.signingKey.publicKey;
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
    _this.wallet = new __wallet__(options.privateKey);
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
    _this2.wallet = _this2.mnemonic ? __wallet__.fromMnemonic(_this2.mnemonic, _this2.path) : __wallet__.createRandom({
      path: _this2.path
    });
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
      return utils.HDNode.mnemonicToSeed(this.wallet.mnemonic);
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
    key: "importKeyStoreWallet",
    value: function () {
      var _importKeyStoreWallet = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee3(_ref2) {
        var identifier, keystore, password, network, fromEncryptedJson;
        return _regenerator["default"].wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                identifier = _ref2.identifier, keystore = _ref2.keystore, password = _ref2.password, network = _ref2.network;
                _context3.next = 3;
                return __wallet__.fromEncryptedJson(keystore, password);

              case 3:
                fromEncryptedJson = _context3.sent;

                if (!fromEncryptedJson.mnemonic) {
                  _context3.next = 6;
                  break;
                }

                return _context3.abrupt("return", Wallet.importMnemonicWallet({
                  identifier: identifier,
                  mnemonic: fromEncryptedJson.mnemonic,
                  network: network
                }));

              case 6:
                return _context3.abrupt("return", Wallet.importPrivateWallet({
                  identifier: identifier,
                  privateKey: fromEncryptedJson.privateKey,
                  network: network
                }));

              case 7:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3);
      }));

      function importKeyStoreWallet(_x3) {
        return _importKeyStoreWallet.apply(this, arguments);
      }

      return importKeyStoreWallet;
    }()
  }, {
    key: "publicToAddress",
    value: function publicToAddress(_ref3) {
      var publicKey = _ref3.publicKey;
      return utils.computeAddress(publicKey);
    }
  }]);
  return Wallet;
}();

module.exports = Wallet;