const BTC = require('./btc/wallet');
const ETH = require('./eth/wallet');
const EOS = require('./eos/wallet');
const ZIL = require('./zil/wallet');

module.exports = {
    BTC,
    ETH,
    EOS,
    ZIL,
    MEETONE: EOS,
    BOS: EOS
};