"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var ecc = require('eosjs-ecc');

var Mnemonic = require('../btc/mnemonic/mnemonic');

var bip32 = require('bip32');

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
    this.language = language || 'en';
    this.path = path || "m/44'/194'/0'/0/0"; //More info on https://github.com/satoshilabs/slips/blob/master/slip-0044.md

    this.mnemonic = mnemonic;
  }

  (0, _createClass2["default"])(BaseWallet, [{
    key: "sign",
    value: function () {
      var _sign = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee(data) {
        var signature, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, message;

        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (!Array.isArray(data)) {
                  _context.next = 24;
                  break;
                }

                signature = [];
                _iteratorNormalCompletion = true;
                _didIteratorError = false;
                _iteratorError = undefined;
                _context.prev = 5;

                for (_iterator = data[Symbol.iterator](); !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                  message = _step.value;
                  signature.push(ecc.signHash(message, this.privateKey));
                }

                _context.next = 13;
                break;

              case 9:
                _context.prev = 9;
                _context.t0 = _context["catch"](5);
                _didIteratorError = true;
                _iteratorError = _context.t0;

              case 13:
                _context.prev = 13;
                _context.prev = 14;

                if (!_iteratorNormalCompletion && _iterator["return"] != null) {
                  _iterator["return"]();
                }

              case 16:
                _context.prev = 16;

                if (!_didIteratorError) {
                  _context.next = 19;
                  break;
                }

                throw _iteratorError;

              case 19:
                return _context.finish(16);

              case 20:
                return _context.finish(13);

              case 21:
                return _context.abrupt("return", signature);

              case 24:
                return _context.abrupt("return", ecc.signHash(data, this.privateKey));

              case 25:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this, [[5, 9, 13, 21], [14,, 16, 20]]);
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
        privateKey: this._privateKey,
        publicKey: this._publicKey,
        address: this.address,
        mnemonic: this._mnemonic,
        language: this.language,
        path: this.path,
        seed: this._seed
      });
    }
  }, {
    key: "_privateKey",
    get: function get() {
      return this.privateKey;
    }
  }, {
    key: "_publicKey",
    get: function get() {
      return ecc.privateToPublic(this._privateKey);
    }
  }, {
    key: "address",
    get: function get() {
      return '';
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
    _this.privateKey = options.privateKey;
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
    _this2.privateKey = ecc.seedPrivate(BIP32.privateKey.toString('hex'));
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
      return publicKey;
    }
  }]);
  return Wallet;
}();

module.exports = Wallet;