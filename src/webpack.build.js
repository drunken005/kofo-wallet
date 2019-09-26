const KofoWallet = require('./index');
(function () {
    if (!window.KofoWallet) {
        window.KofoWallet = KofoWallet;
    }
})();