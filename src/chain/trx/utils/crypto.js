const {ADDRESS_PREFIX, ADDRESS_PREFIX_BYTE, ADDRESS_SIZE} = require('./address');
const {base64EncodeToString} = require('./code');
const {base64DecodeFromString, hexStr2byteArray} = require('./code');
const {encode58, decode58} = require('./base58');
const {byte2hexStr, byteArray2hexStr} = require('./bytes');

const {ec: EC} = require('elliptic');
const {utils} = require('ethers');
const {keccak256, sha256} = utils;

function getBase58CheckAddress(addressBytes) {
    const hash0 = SHA256(addressBytes);
    const hash1 = SHA256(hash0);

    let checkSum = hash1.slice(0, 4);
    checkSum = addressBytes.concat(checkSum);

    return encode58(checkSum);
}

function decodeBase58Address(base58Sting) {
    if (typeof (base58Sting) != 'string')
        return false;

    if (base58Sting.length <= 4)
        return false;

    let address = decode58(base58Sting);

    if (base58Sting.length <= 4)
        return false;

    const len = address.length;
    const offset = len - 4;
    const checkSum = address.slice(offset);

    address = address.slice(0, offset);

    const hash0 = SHA256(address);
    const hash1 = SHA256(hash0);
    const checkSum1 = hash1.slice(0, 4);

    if (checkSum[0] === checkSum1[0] && checkSum[1] === checkSum1[1] && checkSum[2] ===
        checkSum1[2] && checkSum[3] === checkSum1[3]
    ) {
        return address;
    }

    throw new Error('Invalid address provided');
}

function signTransaction(priKeyBytes, transaction) {
    if (typeof priKeyBytes === 'string')
        priKeyBytes = hexStr2byteArray(priKeyBytes);

    const txID = transaction.txID;
    const signature = ECKeySign(hexStr2byteArray(txID), priKeyBytes);

    if (Array.isArray(transaction.signature)) {
        if (!transaction.signature.includes(signature))
            transaction.signature.push(signature);
    } else
        transaction.signature = [signature];
    return transaction;
}

function arrayToBase64String(a) {
    return btoa(String.fromCharCode(...a));
}

function signBytes(privateKey, contents) {
    if (typeof privateKey === 'string')
        privateKey = hexStr2byteArray(privateKey);

    const hashBytes = SHA256(contents);
    const signBytes = ECKeySign(hashBytes, privateKey);

    return signBytes;
}

function getRowBytesFromTransactionBase64(base64Data) {
    const bytesDecode = base64DecodeFromString(base64Data);
    const transaction = proto.protocol.Transaction.deserializeBinary(bytesDecode);
    const raw = transaction.getRawData();

    return raw.serializeBinary();
}

function genPriKey() {
    const ec = new EC('secp256k1');
    const key = ec.genKeyPair();
    const priKey = key.getPrivate();

    let priKeyHex = priKey.toString('hex');

    while (priKeyHex.length < 64) {
        priKeyHex = `0${priKeyHex}`;
    }

    return hexStr2byteArray(priKeyHex);
}

function computeAddress(pubBytes) {
    if (pubBytes.length === 65)
        pubBytes = pubBytes.slice(1);

    const hash = keccak256(pubBytes).toString().substring(2);
    const addressHex = ADDRESS_PREFIX + hash.substring(24);

    return hexStr2byteArray(addressHex);
}

function getAddressFromPriKey(priKeyBytes) {
    let pubBytes = getPubKeyFromPriKey(priKeyBytes);
    return computeAddress(pubBytes);
}

function decode58Check(addressStr) {
    const decodeCheck = decode58(addressStr);

    if (decodeCheck.length <= 4)
        return false;

    const decodeData = decodeCheck.slice(0, decodeCheck.length - 4);
    const hash0 = SHA256(decodeData);
    const hash1 = SHA256(hash0);

    if (hash1[0] === decodeCheck[decodeData.length] &&
        hash1[1] === decodeCheck[decodeData.length + 1] &&
        hash1[2] === decodeCheck[decodeData.length + 2] &&
        hash1[3] === decodeCheck[decodeData.length + 3]) {
        return decodeData;
    }

    return false;
}

function isAddressValid(base58Str) {
    if (typeof (base58Str) !== 'string')
        return false;

    if (base58Str.length !== ADDRESS_SIZE)
        return false;

    let address = decode58(base58Str);

    if (address.length !== 25)
        return false;

    if (address[0] !== ADDRESS_PREFIX_BYTE)
        return false;

    const checkSum = address.slice(21);
    address = address.slice(0, 21);

    const hash0 = SHA256(address);
    const hash1 = SHA256(hash0);
    const checkSum1 = hash1.slice(0, 4);

    if (checkSum[0] == checkSum1[0] && checkSum[1] == checkSum1[1] && checkSum[2] ==
        checkSum1[2] && checkSum[3] == checkSum1[3]
    ) {
        return true
    }

    return false;
}

function getBase58CheckAddressFromPriKeyBase64String(priKeyBase64String) {
    const priKeyBytes = base64DecodeFromString(priKeyBase64String);
    const pubBytes = getPubKeyFromPriKey(priKeyBytes);
    const addressBytes = computeAddress(pubBytes);

    return getBase58CheckAddress(addressBytes);
}

function getHexStrAddressFromPriKeyBase64String(priKeyBase64String) {
    const priKeyBytes = base64DecodeFromString(priKeyBase64String);
    const pubBytes = getPubKeyFromPriKey(priKeyBytes);
    const addressBytes = computeAddress(pubBytes);
    const addressHex = byteArray2hexStr(addressBytes);

    return addressHex;
}

function getAddressFromPriKeyBase64String(priKeyBase64String) {
    const priKeyBytes = base64DecodeFromString(priKeyBase64String);
    const pubBytes = getPubKeyFromPriKey(priKeyBytes);
    const addressBytes = computeAddress(pubBytes);
    const addressBase64 = base64EncodeToString(addressBytes);

    return addressBase64;
}

function getPubKeyFromPriKey(priKeyBytes) {
    const ec = new EC('secp256k1');
    const key = ec.keyFromPrivate(priKeyBytes, 'bytes');
    const pubkey = key.getPublic();
    const x = pubkey.x;
    const y = pubkey.y;

    let xHex = x.toString('hex');

    while (xHex.length < 64) {
        xHex = `0${xHex}`;
    }

    let yHex = y.toString('hex');

    while (yHex.length < 64) {
        yHex = `0${yHex}`;
    }

    const pubkeyHex = `04${xHex}${yHex}`;
    const pubkeyBytes = hexStr2byteArray(pubkeyHex);

    return pubkeyBytes;
}

function ECKeySign(hashBytes, priKeyBytes) {
    const ec = new EC('secp256k1');
    const key = ec.keyFromPrivate(priKeyBytes, 'bytes');
    const signature = key.sign(hashBytes);
    const r = signature.r;
    const s = signature.s;
    const id = signature.recoveryParam;

    let rHex = r.toString('hex');

    while (rHex.length < 64) {
        rHex = `0${rHex}`;
    }

    let sHex = s.toString('hex');

    while (sHex.length < 64) {
        sHex = `0${sHex}`;
    }

    const idHex = byte2hexStr(id);
    const signHex = rHex + sHex + idHex;

    return signHex;
}

function SHA256(msgBytes) {
    const msgHex = byteArray2hexStr(msgBytes);
    const hashHex = sha256('0x' + msgHex).replace(/^0x/, '')
    return hexStr2byteArray(hashHex);
}

function passwordToAddress(password) {
    const com_priKeyBytes = base64DecodeFromString(password);
    const com_addressBytes = getAddressFromPriKey(com_priKeyBytes);

    return getBase58CheckAddress(com_addressBytes);
}

function pkToAddress(privateKey) {
    const com_priKeyBytes = hexStr2byteArray(privateKey);
    const com_addressBytes = getAddressFromPriKey(com_priKeyBytes);

    return getBase58CheckAddress(com_addressBytes);
}

module.exports = {
    getBase58CheckAddress,
    decodeBase58Address,
    signTransaction,
    arrayToBase64String,
    signBytes,
    getRowBytesFromTransactionBase64,
    genPriKey,
    computeAddress,
    getAddressFromPriKey,
    decode58Check,
    isAddressValid,
    getBase58CheckAddressFromPriKeyBase64String,
    getHexStrAddressFromPriKeyBase64String,
    getAddressFromPriKeyBase64String,
    getPubKeyFromPriKey,
    ECKeySign,
    SHA256,
    passwordToAddress,
    pkToAddress,
};
