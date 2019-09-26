"use strict";

var BTC = require('./btc/wallet');

var ETH = require('./eth/wallet');

var EOS = require('./eos/wallet');

var ZIL = require('./zil/wallet');

var HPB = require('./hpb/wallet');

var BNB = require('./bnb/wallet');

var TRX = require('./trx/wallet');

module.exports = {
  BTC: BTC,
  ETH: ETH,
  EOS: EOS,
  ZIL: ZIL,
  HPB: HPB,
  MEETONE: EOS,
  BOS: EOS,
  BNB: BNB,
  TRX: TRX
};