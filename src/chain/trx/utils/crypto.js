"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _require = require('./address'),
    ADDRESS_PREFIX = _require.ADDRESS_PREFIX,
    ADDRESS_PREFIX_BYTE = _require.ADDRESS_PREFIX_BYTE,
    ADDRESS_SIZE = _require.ADDRESS_SIZE;

var _require2 = require('./code'),
    base64EncodeToString = _require2.base64EncodeToString;

var _require3 = require('./code'),
    base64DecodeFromString = _require3.base64DecodeFromString,
    hexStr2byteArray = _require3.hexStr2byteArray;

var _require4 = require('./base58'),
    encode58 = _require4.encode58,
    decode58 = _require4.decode58;

var _require5 = require('./bytes'),
    byte2hexStr = _require5.byte2hexStr,
    byteArray2hexStr = _require5.byteArray2hexStr;

var _require6 = require('elliptic'),
    EC = _require6.ec;

var _require7 = require('ethers'),
    utils = _require7.utils;

var keccak256 = utils.keccak256,
    sha256 = utils.sha256;

function getBase58CheckAddress(addressBytes) {
  var hash0 = SHA256(addressBytes);
  var hash1 = SHA256(hash0);
  var checkSum = hash1.slice(0, 4);
  checkSum = addressBytes.concat(checkSum);
  return encode58(checkSum);
}

function decodeBase58Address(base58Sting) {
  if (typeof base58Sting != 'string') return false;
  if (base58Sting.length <= 4) return false;
  var address = decode58(base58Sting);
  if (base58Sting.length <= 4) return false;
  var len = address.length;
  var offset = len - 4;
  var checkSum = address.slice(offset);
  address = address.slice(0, offset);
  var hash0 = SHA256(address);
  var hash1 = SHA256(hash0);
  var checkSum1 = hash1.slice(0, 4);

  if (checkSum[0] === checkSum1[0] && checkSum[1] === checkSum1[1] && checkSum[2] === checkSum1[2] && checkSum[3] === checkSum1[3]) {
    return address;
  }

  throw new Error('Invalid address provided');
}

function signTransaction(priKeyBytes, transaction) {
  if (typeof priKeyBytes === 'string') priKeyBytes = hexStr2byteArray(priKeyBytes);
  var txID = transaction.txID;
  var signature = ECKeySign(hexStr2byteArray(txID), priKeyBytes);

  if (Array.isArray(transaction.signature)) {
    if (!transaction.signature.includes(signature)) transaction.signature.push(signature);
  } else transaction.signature = [signature];

  return transaction;
}

function arrayToBase64String(a) {
  return btoa(String.fromCharCode.apply(String, (0, _toConsumableArray2["default"])(a)));
}

function signBytes(privateKey, contents) {
  if (typeof privateKey === 'string') privateKey = hexStr2byteArray(privateKey);
  var hashBytes = SHA256(contents);
  var signBytes = ECKeySign(hashBytes, privateKey);
  return signBytes;
}

function getRowBytesFromTransactionBase64(base64Data) {
  var bytesDecode = base64DecodeFromString(base64Data);
  var transaction = proto.protocol.Transaction.deserializeBinary(bytesDecode);
  var raw = transaction.getRawData();
  return raw.serializeBinary();
}

function genPriKey() {
  var ec = new EC('secp256k1');
  var key = ec.genKeyPair();
  var priKey = key.getPrivate();
  var priKeyHex = priKey.toString('hex');

  while (priKeyHex.length < 64) {
    priKeyHex = "0".concat(priKeyHex);
  }

  return hexStr2byteArray(priKeyHex);
}

function computeAddress(pubBytes) {
  if (pubBytes.length === 65) pubBytes = pubBytes.slice(1);
  var hash = keccak256(pubBytes).toString().substring(2);
  var addressHex = ADDRESS_PREFIX + hash.substring(24);
  return hexStr2byteArray(addressHex);
}

function getAddressFromPriKey(priKeyBytes) {
  var pubBytes = getPubKeyFromPriKey(priKeyBytes);
  return computeAddress(pubBytes);
}

function decode58Check(addressStr) {
  var decodeCheck = decode58(addressStr);
  if (decodeCheck.length <= 4) return false;
  var decodeData = decodeCheck.slice(0, decodeCheck.length - 4);
  var hash0 = SHA256(decodeData);
  var hash1 = SHA256(hash0);

  if (hash1[0] === decodeCheck[decodeData.length] && hash1[1] === decodeCheck[decodeData.length + 1] && hash1[2] === decodeCheck[decodeData.length + 2] && hash1[3] === decodeCheck[decodeData.length + 3]) {
    return decodeData;
  }

  return false;
}

function isAddressValid(base58Str) {
  if (typeof base58Str !== 'string') return false;
  if (base58Str.length !== ADDRESS_SIZE) return false;
  var address = decode58(base58Str);
  if (address.length !== 25) return false;
  if (address[0] !== ADDRESS_PREFIX_BYTE) return false;
  var checkSum = address.slice(21);
  address = address.slice(0, 21);
  var hash0 = SHA256(address);
  var hash1 = SHA256(hash0);
  var checkSum1 = hash1.slice(0, 4);

  if (checkSum[0] == checkSum1[0] && checkSum[1] == checkSum1[1] && checkSum[2] == checkSum1[2] && checkSum[3] == checkSum1[3]) {
    return true;
  }

  return false;
}

function getBase58CheckAddressFromPriKeyBase64String(priKeyBase64String) {
  var priKeyBytes = base64DecodeFromString(priKeyBase64String);
  var pubBytes = getPubKeyFromPriKey(priKeyBytes);
  var addressBytes = computeAddress(pubBytes);
  return getBase58CheckAddress(addressBytes);
}

function getHexStrAddressFromPriKeyBase64String(priKeyBase64String) {
  var priKeyBytes = base64DecodeFromString(priKeyBase64String);
  var pubBytes = getPubKeyFromPriKey(priKeyBytes);
  var addressBytes = computeAddress(pubBytes);
  var addressHex = byteArray2hexStr(addressBytes);
  return addressHex;
}

function getAddressFromPriKeyBase64String(priKeyBase64String) {
  var priKeyBytes = base64DecodeFromString(priKeyBase64String);
  var pubBytes = getPubKeyFromPriKey(priKeyBytes);
  var addressBytes = computeAddress(pubBytes);
  var addressBase64 = base64EncodeToString(addressBytes);
  return addressBase64;
}

function getPubKeyFromPriKey(priKeyBytes) {
  var ec = new EC('secp256k1');
  var key = ec.keyFromPrivate(priKeyBytes, 'bytes');
  var pubkey = key.getPublic();
  var x = pubkey.x;
  var y = pubkey.y;
  var xHex = x.toString('hex');

  while (xHex.length < 64) {
    xHex = "0".concat(xHex);
  }

  var yHex = y.toString('hex');

  while (yHex.length < 64) {
    yHex = "0".concat(yHex);
  }

  var pubkeyHex = "04".concat(xHex).concat(yHex);
  var pubkeyBytes = hexStr2byteArray(pubkeyHex);
  return pubkeyBytes;
}

function ECKeySign(hashBytes, priKeyBytes) {
  var ec = new EC('secp256k1');
  var key = ec.keyFromPrivate(priKeyBytes, 'bytes');
  var signature = key.sign(hashBytes);
  var r = signature.r;
  var s = signature.s;
  var id = signature.recoveryParam;
  var rHex = r.toString('hex');

  while (rHex.length < 64) {
    rHex = "0".concat(rHex);
  }

  var sHex = s.toString('hex');

  while (sHex.length < 64) {
    sHex = "0".concat(sHex);
  }

  var idHex = byte2hexStr(id);
  var signHex = rHex + sHex + idHex;
  return signHex;
}

function SHA256(msgBytes) {
  var msgHex = byteArray2hexStr(msgBytes);
  var hashHex = sha256('0x' + msgHex).replace(/^0x/, '');
  return hexStr2byteArray(hashHex);
}

function passwordToAddress(password) {
  var com_priKeyBytes = base64DecodeFromString(password);
  var com_addressBytes = getAddressFromPriKey(com_priKeyBytes);
  return getBase58CheckAddress(com_addressBytes);
}

function pkToAddress(privateKey) {
  var com_priKeyBytes = hexStr2byteArray(privateKey);
  var com_addressBytes = getAddressFromPriKey(com_priKeyBytes);
  return getBase58CheckAddress(com_addressBytes);
}

module.exports = {
  getBase58CheckAddress: getBase58CheckAddress,
  decodeBase58Address: decodeBase58Address,
  signTransaction: signTransaction,
  arrayToBase64String: arrayToBase64String,
  signBytes: signBytes,
  getRowBytesFromTransactionBase64: getRowBytesFromTransactionBase64,
  genPriKey: genPriKey,
  computeAddress: computeAddress,
  getAddressFromPriKey: getAddressFromPriKey,
  decode58Check: decode58Check,
  isAddressValid: isAddressValid,
  getBase58CheckAddressFromPriKeyBase64String: getBase58CheckAddressFromPriKeyBase64String,
  getHexStrAddressFromPriKeyBase64String: getHexStrAddressFromPriKeyBase64String,
  getAddressFromPriKeyBase64String: getAddressFromPriKeyBase64String,
  getPubKeyFromPriKey: getPubKeyFromPriKey,
  ECKeySign: ECKeySign,
  SHA256: SHA256,
  passwordToAddress: passwordToAddress,
  pkToAddress: pkToAddress
};