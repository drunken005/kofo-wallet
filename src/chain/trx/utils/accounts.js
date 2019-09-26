const {byteArray2hexStr} = require('./bytes');
const {
    getBase58CheckAddress,
    genPriKey,
    getAddressFromPriKey,
    getPubKeyFromPriKey
} = require('./crypto');

function generateAccount() {
    const priKeyBytes = genPriKey();
    const pubKeyBytes = getPubKeyFromPriKey(priKeyBytes);
    const addressBytes = getAddressFromPriKey(priKeyBytes);

    const privateKey = byteArray2hexStr(priKeyBytes);
    const publicKey = byteArray2hexStr(pubKeyBytes);

    return {
        privateKey,
        publicKey,
        address: {
            base58: getBase58CheckAddress(addressBytes),
            hex: byteArray2hexStr(addressBytes)
        }
    }
}



console.log(generateAccount());