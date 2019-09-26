"use strict";

var _require = require('ethers'),
    utils = _require.utils,
    errors = _require.errors,
    constants = _require.constants;

var chainId = {
  livenet: 269,
  testnet: 1
};

function handleAddress(value) {
  if (value === '0x') {
    return null;
  }

  return utils.getAddress(value);
}

function handleNumber(value) {
  if (value === '0x') {
    return constants.Zero;
  }

  return utils.bigNumberify(value);
}

function parse(rawTransaction) {
  var network = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'livenet';
  var transaction = utils.RLP.decode(rawTransaction);

  if (transaction.length !== 9 && transaction.length !== 6) {
    errors.throwError('invalid raw transaction', errors.INVALID_ARGUMENT, {
      arg: 'rawTransactin',
      value: rawTransaction
    });
  }

  var tx = {
    nonce: handleNumber(transaction[0]).toNumber(),
    gasPrice: handleNumber(transaction[1]),
    gasLimit: handleNumber(transaction[2]),
    to: handleAddress(transaction[3]),
    value: handleNumber(transaction[4]),
    data: transaction[5],
    chainId: chainId[network]
  }; // Legacy unsigned transaction

  if (transaction.length === 6) {
    return tx;
  }

  try {
    tx.v = utils.bigNumberify(transaction[6]).toNumber();
  } catch (error) {
    errors.info(error);
    return tx;
  }

  tx.r = utils.hexZeroPad(transaction[7], 32);
  tx.s = utils.hexZeroPad(transaction[8], 32);

  if (utils.bigNumberify(tx.r).isZero() && utils.bigNumberify(tx.s).isZero()) {
    // EIP-155 unsigned transaction
    tx.chainId = tx.v;
    tx.v = 0;
  } else {
    // Signed Tranasaction
    tx.chainId = Math.floor((tx.v - 35) / 2);

    if (tx.chainId < 0) {
      tx.chainId = 0;
    }

    var recoveryParam = tx.v - 27;
    var raw = transaction.slice(0, 6);

    if (tx.chainId !== 0) {
      raw.push(utils.hexlify(tx.chainId));
      raw.push('0x');
      raw.push('0x');
      recoveryParam -= tx.chainId * 2 + 8;
    }

    var digest = utils.keccak256(utils.RLP.encode(raw));

    try {
      tx.from = utils.recoverAddress(digest, {
        r: utils.hexlify(tx.r),
        s: utils.hexlify(tx.s),
        recoveryParam: recoveryParam
      });
    } catch (error) {
      errors.info(error);
    }

    tx.hash = utils.keccak256(rawTransaction);
  }

  return tx;
}

exports.parseTransaction = parse;
exports.handleNumber = handleNumber;