"use strict";

var _require = require('./base64'),
    Base64 = _require.Base64;

function byte2hexStr(_byte) {
  if (typeof _byte !== 'number') throw new Error('Input must be a number');
  if (_byte < 0 || _byte > 255) throw new Error('Input must be a byte');
  var hexByteMap = '0123456789ABCDEF';
  var str = '';
  str += hexByteMap.charAt(_byte >> 4);
  str += hexByteMap.charAt(_byte & 0x0f);
  return str;
}

function bytesToString(arr) {
  if (typeof arr === 'string') return arr;
  var str = '';

  for (var i = 0; i < arr.length; i++) {
    var one = arr[i].toString(2);
    var v = one.match(/^1+?(?=0)/);

    if (v && one.length === 8) {
      var bytesLength = v[0].length;
      var store = arr[i].toString(2).slice(7 - bytesLength);

      for (var st = 1; st < bytesLength; st++) {
        store += arr[st + i].toString(2).slice(2);
      }

      str += String.fromCharCode(parseInt(store, 2));
      i += bytesLength - 1;
    } else {
      str += String.fromCharCode(arr[i]);
    }
  }

  return str;
}

function hextoString(hex) {
  var arr = hex.replace(/^0x/, '').split('');
  var out = '';

  for (var i = 0; i < arr.length / 2; i++) {
    var tmp = "0x".concat(arr[i * 2]).concat(arr[i * 2 + 1]);
    out += String.fromCharCode(tmp);
  }

  return out;
}

function byteArray2hexStr(byteArray) {
  var str = '';

  for (var i = 0; i < byteArray.length; i++) {
    str += byte2hexStr(byteArray[i]);
  }

  return str;
}

function base64DecodeFromString(string64) {
  return new Base64().decodeToByteArray(string64);
}

function base64EncodeToString(bytes) {
  var b = new Base64();
  var string64 = b.encodeIgnoreUtf8(bytes);
  return string64;
}

module.exports = {
  byte2hexStr: byte2hexStr,
  bytesToString: bytesToString,
  hextoString: hextoString,
  byteArray2hexStr: byteArray2hexStr,
  base64DecodeFromString: base64DecodeFromString,
  base64EncodeToString: base64EncodeToString
};