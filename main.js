const SHA256 = require("crypto-js/sha256");

class Block {
  constructor(index, timestamp, data, previousHash = "") {
    this.index = index;
    this.timestamp = timestamp;
    this.data = data;
    this.previousHash = previousHash;
    this.hash = this.calculateHash();
  }

  calculateHash() {
    return SHA256(
      this.index +
        this.timestamp +
        JSON.stringify(this.data) +
        this.previousHash
    ).toString();
  }
}

class Blockchain {
  constructor() {
    this.chain = [this.createGenesisBlock()];
  }

  createGenesisBlock() {
    return new Block(0, "04/06/2025", "Genesis Block", "0");
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  addBlock(newBlock) {
    newBlock.previousHash = this.getLatestBlock().hash;
    newBlock.hash = newBlock.calculateHash();
    this.chain.push(newBlock);
  }

  isChainValid() {
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];

      if (currentBlock.hash !== currentBlock.calculateHash()) {
        return false;
      }

      if (currentBlock.previousHash !== previousBlock.hash) {
        return false;
      }
    }
    return true;
  }
}

let pjcoin = new Blockchain();
pjcoin.addBlock(new Block(1, "05/06/2025", { amount: 4 }));
pjcoin.addBlock(new Block(2, "05/06/2025", { amount: 10 }));

console.log("Is blockchain valid? " + pjcoin.isChainValid());

pjcoin.chain[1].data = { amount: 100 }; // Tampering with the data
pjcoin.chain[1].hash = pjcoin.chain[1].calculateHash(); // Recalculate hash

console.log("Is blockchain valid? " + pjcoin.isChainValid());

// console.log(JSON.stringify(pjcoin, null, 4));
