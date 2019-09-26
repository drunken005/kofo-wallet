"use strict";

function Base64() {
  var _this = this;

  this._keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

  this.encode = function (input) {
    var output = "";
    var chr1;
    var chr2;
    var chr3;
    var enc1;
    var enc2;
    var enc3;
    var enc4;
    var i = 0;

    while (i < input.length) {
      chr1 = input.charCodeAt(i++);
      chr2 = input.charCodeAt(i++);
      chr3 = input.charCodeAt(i++);
      enc1 = chr1 >> 2;
      enc2 = (chr1 & 3) << 4 | chr2 >> 4;
      enc3 = (chr2 & 15) << 2 | chr3 >> 6;
      enc4 = chr3 & 63;
      if (isNaN(chr2)) enc3 = enc4 = 64;else if (isNaN(chr3)) enc4 = 64;
      output = output + _this._keyStr.charAt(enc1) + _this._keyStr.charAt(enc2) + _this._keyStr.charAt(enc3) + _this._keyStr.charAt(enc4);
    }

    return output;
  };

  this.encodeIgnoreUtf8 = function (inputBytes) {
    var output = "";
    var chr1;
    var chr2;
    var chr3;
    var enc1;
    var enc2;
    var enc3;
    var enc4;
    var i = 0;

    while (i < inputBytes.length) {
      chr1 = inputBytes[i++];
      chr2 = inputBytes[i++];
      chr3 = inputBytes[i++];
      enc1 = chr1 >> 2;
      enc2 = (chr1 & 3) << 4 | chr2 >> 4;
      enc3 = (chr2 & 15) << 2 | chr3 >> 6;
      enc4 = chr3 & 63;
      if (isNaN(chr2)) enc3 = enc4 = 64;else if (isNaN(chr3)) enc4 = 64;
      output = output + _this._keyStr.charAt(enc1) + _this._keyStr.charAt(enc2) + _this._keyStr.charAt(enc3) + _this._keyStr.charAt(enc4);
    }

    return output;
  };

  this.decode = function (input) {
    var output = "";
    var chr1;
    var chr2;
    var chr3;
    var enc1;
    var enc2;
    var enc3;
    var enc4;
    var i = 0;
    input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

    while (i < input.length) {
      enc1 = _this._keyStr.indexOf(input.charAt(i++));
      enc2 = _this._keyStr.indexOf(input.charAt(i++));
      enc3 = _this._keyStr.indexOf(input.charAt(i++));
      enc4 = _this._keyStr.indexOf(input.charAt(i++));
      chr1 = enc1 << 2 | enc2 >> 4;
      chr2 = (enc2 & 15) << 4 | enc3 >> 2;
      chr3 = (enc3 & 3) << 6 | enc4;
      output = output + String.fromCharCode(chr1);
      if (enc3 != 64) output = output + String.fromCharCode(chr2);
      if (enc4 != 64) output = output + String.fromCharCode(chr3);
    }

    return _this._utf8_decode(output);
  };

  this.decodeToByteArray = function (input) {
    var output = "";
    var chr1;
    var chr2;
    var chr3;
    var enc1;
    var enc2;
    var enc3;
    var enc4;
    var i = 0;
    input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

    while (i < input.length) {
      enc1 = _this._keyStr.indexOf(input.charAt(i++));
      enc2 = _this._keyStr.indexOf(input.charAt(i++));
      enc3 = _this._keyStr.indexOf(input.charAt(i++));
      enc4 = _this._keyStr.indexOf(input.charAt(i++));
      chr1 = enc1 << 2 | enc2 >> 4;
      chr2 = (enc2 & 15) << 4 | enc3 >> 2;
      chr3 = (enc3 & 3) << 6 | enc4;
      output = output + String.fromCharCode(chr1);
      if (enc3 != 64) output = output + String.fromCharCode(chr2);
      if (enc4 != 64) output = output + String.fromCharCode(chr3);
    }

    return _this._out2ByteArray(output);
  };

  this._out2ByteArray = function (utftext) {
    var byteArray = new Array(utftext.length);
    var i = 0;
    var c = 0;

    while (i < utftext.length) {
      c = utftext.charCodeAt(i);
      byteArray[i] = c;
      i++;
    }

    return byteArray;
  };

  this._utf8_encode = function (string) {
    string = string.replace(/\r\n/g, "\n");
    var utftext = "";

    for (var n = 0; n < string.length; n++) {
      var c = string.charCodeAt(n);

      if (c < 128) {
        utftext += String.fromCharCode(c);
      } else if (c > 127 && c < 2048) {
        utftext += String.fromCharCode(c >> 6 | 192);
        utftext += String.fromCharCode(c & 63 | 128);
      } else {
        utftext += String.fromCharCode(c >> 12 | 224);
        utftext += String.fromCharCode(c >> 6 & 63 | 128);
        utftext += String.fromCharCode(c & 63 | 128);
      }
    }

    return utftext;
  };

  this._utf8_decode = function (utftext) {
    var string = "";
    var i = 0;
    var c = 0;
    var c2 = 0;
    var c3 = 0;

    while (i < utftext.length) {
      c = utftext.charCodeAt(i);

      if (c < 128) {
        string += String.fromCharCode(c);
        i++;
      } else if (c > 191 && c < 224) {
        c2 = utftext.charCodeAt(i + 1);
        string += String.fromCharCode((c & 31) << 6 | c2 & 63);
        i += 2;
      } else {
        c2 = utftext.charCodeAt(i + 1);
        c3 = utftext.charCodeAt(i + 2);
        string += String.fromCharCode((c & 15) << 12 | (c2 & 63) << 6 | c3 & 63);
        i += 3;
      }
    }

    return string;
  };
}

module.exports = {
  Base64: Base64
};