const BTC = require('./btc/wallet');
const ETH = require('./eth/wallet');
const EOS = require('./eos/wallet');
// const ZIL = require('./zil/wallet');
const HPB = require('./hpb/wallet');
const BNB = require('./bnb/wallet');
const TRX = require('./trx/wallet');

module.exports = {
    BTC,
    ETH,
    EOS,
    // ZIL,
    HPB,
    MEETONE: EOS,
    BOS: EOS,
    BNB,
    TRX
};