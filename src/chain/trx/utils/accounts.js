"use strict";

var _require = require('./bytes'),
    byteArray2hexStr = _require.byteArray2hexStr;

var _require2 = require('./crypto'),
    getBase58CheckAddress = _require2.getBase58CheckAddress,
    genPriKey = _require2.genPriKey,
    getAddressFromPriKey = _require2.getAddressFromPriKey,
    getPubKeyFromPriKey = _require2.getPubKeyFromPriKey;

function generateAccount() {
  var priKeyBytes = genPriKey();
  var pubKeyBytes = getPubKeyFromPriKey(priKeyBytes);
  var addressBytes = getAddressFromPriKey(priKeyBytes);
  var privateKey = byteArray2hexStr(priKeyBytes);
  var publicKey = byteArray2hexStr(pubKeyBytes);
  return {
    privateKey: privateKey,
    publicKey: publicKey,
    address: {
      base58: getBase58CheckAddress(addressBytes),
      hex: byteArray2hexStr(addressBytes)
    }
  };
}

console.log(generateAccount());