const bip32 = require('bip32');
const unorm = require('unorm');
const bitcore = require('bitcore-lib');
const errors = require('./error');
const pbkdf2 = require('./pbkdf2');


const {Hash, BN} = bitcore.crypto;
const Network = bitcore.Networks;
const HDPrivateKey = bitcore.HDPrivateKey;
const _ = bitcore.deps._;
const $ = bitcore.util.preconditions;
const Random = bitcore.crypto.Random;

function Mnemonic(data, wordlist) {
    if (!(this instanceof Mnemonic)) {
        return new Mnemonic(data, wordlist);
    }

    if (_.isArray(data)) {
        wordlist = data;
        data = null;
    }


    // handle data overloading
    var ent, phrase, seed;
    if (Buffer.isBuffer(data)) {
        seed = data;
        ent = seed.length * 8;
    } else if (_.isString(data)) {
        phrase = unorm.nfkd(data);
    } else if (_.isNumber(data)) {
        ent = data;
    } else if (data) {
        throw new bitcore.errors.InvalidArgument('data', 'Must be a Buffer, a string or an integer');
    }
    ent = ent || 128;


    // check and detect wordlist
    wordlist = wordlist || Mnemonic._getDictionary(phrase);
    if (phrase && !wordlist) {
        throw new errors.UnknownWordlist(phrase);
    }
    wordlist = wordlist || Mnemonic.Words.ENGLISH;

    if (seed) {
        phrase = Mnemonic._entropy2mnemonic(seed, wordlist);
    }


    // validate phrase and ent
    if (phrase && !Mnemonic.isValid(phrase, wordlist)) {
        throw new errors.InvalidMnemonic(phrase);
    }
    if (ent % 32 !== 0 || ent < 128 || ent > 256) {
        throw new bitcore.errors.InvalidArgument('ENT', 'Values must be ENT > 128 and ENT < 256 and ENT % 32 == 0');
    }

    phrase = phrase || Mnemonic._mnemonic(ent, wordlist);

    Object.defineProperty(this, 'wordlist', {
        configurable: false,
        value: wordlist
    });

    Object.defineProperty(this, 'phrase', {
        configurable: false,
        value: phrase
    });
}

Mnemonic.Words = require('./words');


/**
 * Will return a boolean if the mnemonic is valid
 *
 * @example
 *
 * var valid = Mnemonic.isValid('lab rescue lunch elbow recall phrase perfect donkey biology guess moment husband');
 * // true
 *
 * @param {String} mnemonic - The mnemonic string
 * @param {String} [wordlist] - The wordlist used
 * @returns {boolean}
 */
Mnemonic.isValid = function (mnemonic, wordlist) {
    mnemonic = unorm.nfkd(mnemonic);
    wordlist = wordlist || Mnemonic._getDictionary(mnemonic);

    if (!wordlist) {
        return false;
    }

    var words = mnemonic.split(' ');
    var bin = '';
    for (var i = 0; i < words.length; i++) {
        var ind = wordlist.indexOf(words[i]);
        if (ind < 0) return false;
        bin = bin + ('00000000000' + ind.toString(2)).slice(-11);
    }

    var cs = bin.length / 33;
    var hash_bits = bin.slice(-cs);
    var nonhash_bits = bin.slice(0, bin.length - cs);
    var buf = Buffer.alloc(nonhash_bits.length / 8);
    for (i = 0; i < nonhash_bits.length / 8; i++) {
        buf.writeUInt8(parseInt(bin.slice(i * 8, (i + 1) * 8), 2), i);
    }
    var expected_hash_bits = Mnemonic._entropyChecksum(buf);
    return expected_hash_bits === hash_bits;
};

/**
 * Internal function to check if a mnemonic belongs to a wordlist.
 *
 * @param {String} mnemonic - The mnemonic string
 * @param {String} wordlist - The wordlist
 * @returns {boolean}
 */
Mnemonic._belongsToWordlist = function (mnemonic, wordlist) {
    var words = unorm.nfkd(mnemonic).split(' ');
    for (var i = 0; i < words.length; i++) {
        var ind = wordlist.indexOf(words[i]);
        if (ind < 0) return false;
    }
    return true;
};

/**
 * Internal function to create checksum of entropy
 *
 * @param {Buffer} entropy
 * @returns {string} Checksum of entropy length / 32
 * @private
 */
Mnemonic._entropyChecksum = function (entropy) {
    var hash = Hash.sha256(entropy);
    var bits = entropy.length * 8;
    var cs = bits / 32;

    var hashbits = new BN(hash.toString('hex'), 16).toString(2);

    // zero pad the hash bits
    while (hashbits.length % 256 !== 0) {
        hashbits = '0' + hashbits;
    }

    var checksum = hashbits.slice(0, cs);

    return checksum;
};

/**
 * Internal function to check if a mnemonic belongs to a wordlist.
 *
 * @param {String} mnemonic - The mnemonic string
 * @param {String} wordlist - The wordlist
 * @returns {boolean}
 */
Mnemonic._belongsToWordlist = function (mnemonic, wordlist) {
    var words = unorm.nfkd(mnemonic).split(' ');
    for (var i = 0; i < words.length; i++) {
        var ind = wordlist.indexOf(words[i]);
        if (ind < 0) return false;
    }
    return true;
};

/**
 * Internal function to detect the wordlist used to generate the mnemonic.
 *
 * @param {String} mnemonic - The mnemonic string
 * @returns {Array} the wordlist or null
 */
Mnemonic._getDictionary = function (mnemonic) {
    if (!mnemonic) return null;

    var dicts = Object.keys(Mnemonic.Words);
    for (var i = 0; i < dicts.length; i++) {
        var key = dicts[i];
        if (Mnemonic._belongsToWordlist(mnemonic, Mnemonic.Words[key])) {
            return Mnemonic.Words[key];
        }
    }
    return null;
};

/**
 * Will generate a seed based on the mnemonic and optional passphrase.
 *
 * @param {String} [passphrase]
 * @returns {Buffer}
 */
Mnemonic.prototype.toSeed = function (passphrase) {
    passphrase = passphrase || '';
    return pbkdf2(unorm.nfkd(this.phrase), unorm.nfkd('mnemonic' + passphrase), 2048, 64);
};

/**
 * Will generate a Mnemonic object based on a seed.
 *
 * @param {Buffer} [seed]
 * @param {string} [wordlist]
 * @returns {Mnemonic}
 */
Mnemonic.fromSeed = function (seed, wordlist) {
    $.checkArgument(Buffer.isBuffer(seed), 'seed must be a Buffer.');
    $.checkArgument(_.isArray(wordlist) || _.isString(wordlist), 'wordlist must be a string or an array.');
    return new Mnemonic(seed, wordlist);
};

Mnemonic.prototype.toHDPrivateKey = function (passphrase, network, path) {
    const seed = this.toSeed(passphrase);
    if (!path) {
        return bitcore.HDPrivateKey.fromSeed(seed, network);
    }
    const root = bip32.fromSeed(seed);
    let BIP32 = root.derivePath(path);
    return new HDPrivateKey({
        network: Network.get(network) || Network.defaultNetwork,
        depth: BIP32.depth,
        parentFingerPrint: BIP32.parentFingerprint,
        childIndex: BIP32.index,
        privateKey: BIP32.privateKey,
        chainCode: BIP32.chainCode
    });

};


/**
 * Will return a the string representation of the mnemonic
 *
 * @returns {String} Mnemonic
 */
Mnemonic.prototype.toString = function () {
    return this.phrase;
};

/**
 * Will return a string formatted for the console
 *
 * @returns {String} Mnemonic
 */
Mnemonic.prototype.inspect = function () {
    return '<Mnemonic: ' + this.toString() + ' >';
};

/**
 * Internal function to generate a random mnemonic
 *
 * @param {Number} ENT - Entropy size, defaults to 128
 * @param {Array} wordlist - Array of words to generate the mnemonic
 * @returns {String} Mnemonic string
 */
Mnemonic._mnemonic = function (ENT, wordlist) {
    var buf = Random.getRandomBuffer(ENT / 8);
    return Mnemonic._entropy2mnemonic(buf, wordlist);
};

/**
 * Internal function to generate mnemonic based on entropy
 *
 * @param {Buffer} entropy - Entropy buffer
 * @param {Array} wordlist - Array of words to generate the mnemonic
 * @returns {String} Mnemonic string
 */
Mnemonic._entropy2mnemonic = function (entropy, wordlist) {
    var bin = '';
    for (var i = 0; i < entropy.length; i++) {
        bin = bin + ('00000000' + entropy[i].toString(2)).slice(-8);
    }

    bin = bin + Mnemonic._entropyChecksum(entropy);
    if (bin.length % 11 !== 0) {
        throw new errors.InvalidEntropy(bin);
    }
    var mnemonic = [];
    for (i = 0; i < bin.length / 11; i++) {
        var wi = parseInt(bin.slice(i * 11, (i + 1) * 11), 2);
        mnemonic.push(wordlist[wi]);
    }
    var ret;
    if (wordlist === Mnemonic.Words.JAPANESE) {
        ret = mnemonic.join('\u3000');
    } else {
        ret = mnemonic.join(' ');
    }
    return ret;
};

/**
 * Internal function to create checksum of entropy
 *
 * @param {Buffer} entropy
 * @returns {string} Checksum of entropy length / 32
 * @private
 */
Mnemonic._entropyChecksum = function (entropy) {
    var hash = Hash.sha256(entropy);
    var bits = entropy.length * 8;
    var cs = bits / 32;

    var hashbits = new BN(hash.toString('hex'), 16).toString(2);

    // zero pad the hash bits
    while (hashbits.length % 256 !== 0) {
        hashbits = '0' + hashbits;
    }

    var checksum = hashbits.slice(0, cs);

    return checksum;
};

Mnemonic.bip32 = bip32;

Mnemonic.WordsForLang = {
    "en": Mnemonic.Words.ENGLISH,
    "es": Mnemonic.Words.SPANISH,
    "ja": Mnemonic.Words.JAPANESE,
    "zh": Mnemonic.Words.CHINESE,
    "fr": Mnemonic.Words.FRENCH,
    "it": Mnemonic.Words.ITALIAN,
};

Mnemonic.getMnemonic = function (language, mnemonic) {
    language = language || 'en';
    let _mnemonic;
    let __language__ = Mnemonic.WordsForLang[language];
    if (!!mnemonic) {
        _mnemonic = new Mnemonic(mnemonic);
    } else {
        _mnemonic = new Mnemonic(__language__);
        while (!Mnemonic.isValid(_mnemonic.toString())) {
            _mnemonic = new Mnemonic(__language__);
        }
    }
    return _mnemonic;
};

module.exports = Mnemonic;

