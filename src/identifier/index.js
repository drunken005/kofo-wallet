"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var Identifier =
/*#__PURE__*/
function () {
  function Identifier(chain, currency) {
    (0, _classCallCheck2["default"])(this, Identifier);
    this.chain = chain ? chain.toUpperCase() : chain;
    this.currency = currency ? currency.toUpperCase() : currency;
  }

  (0, _createClass2["default"])(Identifier, [{
    key: "toString",
    value: function toString() {
      return this.isToken ? "".concat(this.chain, "|TOKEN") : this.toStringChainCurrency();
    }
  }, {
    key: "toStringChainCurrency",
    value: function toStringChainCurrency() {
      return "".concat(this.chain, "|").concat(this.currency);
    }
  }, {
    key: "export",
    value: function _export() {
      return {
        chain: this.chain,
        currency: this.currency,
        isToken: this.isToken
      };
    }
  }, {
    key: "isToken",
    get: function get() {
      return Boolean(this.chain !== this.currency);
    }
  }]);
  return Identifier;
}();

module.exports = Identifier;