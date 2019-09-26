const path = require('path');

module.exports = {
    entry: './src/index.js',
    output: {
        filename: 'kofowallet.js',
        path: path.resolve(__dirname, 'dist')
    }
};