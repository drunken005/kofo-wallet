const assert = require('assert');
const Identifier = require('../src/identifier');

describe('Identifier', () => {
    it('#Identifier constructor', () => {
        let identifier = new Identifier('BTC', 'BTC');
        assert.ok(!identifier.isToken);
        assert.strictEqual(identifier.chain, 'BTC');
        assert.strictEqual(identifier.currency, 'BTC');
        assert.strictEqual(identifier.toString(), 'BTC|BTC');

        identifier = new Identifier('ETH', 'KOFO');
        assert.ok(identifier.isToken);
        assert.notStrictEqual(identifier.chain, 'BTC');
        assert.strictEqual(identifier.currency, 'KOFO');
    })
});