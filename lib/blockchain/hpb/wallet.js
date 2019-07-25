const {Wallet: __wallet__, utils} = require("ethers");
const hpbUtils = require('./util');
const _ = require('lodash');
const COMMA_SYMBOL = ',';
const BLANK_SYMBOL = '';
const DEFAULT_NETWORK = 'livenet';
const chainId = {
    livenet: 269,
    testnet: 1
};

class BaseWallet {
    constructor({identifier, mnemonic, language, path, network}) {
        this.identifier = identifier;
        this.path = path || utils.HDNode.defaultPath; //More info on https://github.com/satoshilabs/slips/blob/master/slip-0044.md
        this.mnemonic = mnemonic;
        this.language = language || 'en';
        this.network = network || DEFAULT_NETWORK;
        if(!chainId[this.network]){
            throw new TypeError('HPB network error,  must be "livenet" or "testnet", default is "livenet"')
        }
    }

    get privateKey() {
        return this.wallet.privateKey;
    }

    get publicKey() {
        return this.wallet.signingKey.publicKey;
    }

    get address() {
        return this.wallet.address;
    }

    get _mnemonic() {
        return "";
    }

    get _seed() {
        return '';
    }

    async sign(data) {
        if (!data) {
            throw new TypeError('Sign data is null');
        }
        const self = this;
        let _formatTransaction = (transaction) => {
            _.each(transaction, (value, key) => {
                if (['gasPrice', 'gasLimit', 'value'].indexOf(key) >= 0) {
                    let number = new Number(value);
                    value = number.toLocaleString().split(COMMA_SYMBOL).join(BLANK_SYMBOL);
                    transaction[key] = hpbUtils.handleNumber(value)
                }

                if (key === 'data' && value.indexOf('0x') !== 0) {
                    transaction[key] = '0x' + value;
                }
            });
            return _.assign(transaction, {chainId: chainId[self.network]})
        };
        let transaction, isRawTx = false;
        if (_.isString(data)) {
            try {
                transaction = JSON.parse(data);
            } catch (e) {
                isRawTx = true;
                transaction = hpbUtils.parseTransaction(data);
            }
            transaction = !isRawTx ? _formatTransaction(transaction) : transaction;
        } else {
            transaction = _formatTransaction(data);
        }
        if (!transaction) {
            throw new TypeError('Transaction is undefined.')
        }
        return await this.wallet.sign(transaction);
    }

    export() {
        let _export = this.identifier.export();
        return Object.assign(_export, {
            privateKey: this.privateKey,
            publicKey: this.publicKey,
            address: this.address,

            mnemonic: this._mnemonic,
            language: this.language,
            path: this.path,
            seed: this._seed,
            network: this.network
        });
    }

    async exportKeyStore(password) {
        return await this.wallet.encrypt(password);
    }
}

class PrivateWallet extends BaseWallet {
    constructor(options) {
        super(options);
        this.wallet = new __wallet__(options.privateKey);
    }
}

class MnemonicWallet extends BaseWallet {
    constructor(options) {
        super(options);
        this.wallet = this.mnemonic ? __wallet__.fromMnemonic(this.mnemonic, this.path) : __wallet__.createRandom({path: this.path});
    }

    get _mnemonic() {
        return this.wallet.mnemonic;
    }

    get _seed() {
        return utils.HDNode.mnemonicToSeed(this.wallet.mnemonic);
    }
}

class Wallet {
    static importPrivateWallet(options) {
        if (!options.privateKey) {
            throw new Error(`Invalid privateKey=${options.privateKey}`);
        }

        return new PrivateWallet(options);
    }

    static createWallet(options) {
        return new MnemonicWallet(options);
    }

    static importMnemonicWallet(options) {
        if (!options.mnemonic) {
            throw new Error(`Invalid mnemonic=${options.mnemonic}`);
        }

        return new MnemonicWallet(options);
    }

    static async importKeyStoreWallet({identifier, keystore, password, network}) {
        let fromEncryptedJson = await __wallet__.fromEncryptedJson(keystore, password);
        if (!!fromEncryptedJson.mnemonic) {
            return Wallet.importMnemonicWallet({
                identifier,
                mnemonic: fromEncryptedJson.mnemonic,
                network
            });
        }

        return Wallet.importPrivateWallet({
            identifier,
            privateKey: fromEncryptedJson.privateKey,
            network
        });
    }

    static publicToAddress({publicKey}) {
        return utils.computeAddress(publicKey);
    }
}

module.exports = Wallet;



