class Identifier {
  constructor(chain, currency){
    this.chain    = chain ? chain.toUpperCase() : chain;
    this.currency = currency ? currency.toUpperCase() : currency;
  }

  toString(){
    return this.isToken ? `${this.chain}|TOKEN` : this.toStringChainCurrency();
  }

  toStringChainCurrency(){
    return `${this.chain}|${this.currency}`;
  }

  get isToken(){
    return Boolean(this.chain !== this.currency);
  }

  export(){
    return {
      chain:    this.chain,
      currency: this.currency,
      isToken:  this.isToken,
    };
  }
}

module.exports = Identifier;