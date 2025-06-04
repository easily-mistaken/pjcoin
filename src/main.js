const SHA256 = require("crypto-js/sha256");

class Transaction {
  constructor(fromAddress, toAddress, amount) {
    this.fromAddress = fromAddress;
    this.toAddress = toAddress;
    this.amount = amount;
  }
}
class Block {
  constructor(timestamp, transactions, previousHash = "") {
    this.timestamp = timestamp;
    this.transactions = transactions;
    this.previousHash = previousHash;
    this.hash = this.calculateHash();
    this.nonce = 0;
  }

  calculateHash() {
    return SHA256(
      this.index +
        this.timestamp +
        JSON.stringify(this.transactions) +
        this.previousHash +
        this.nonce
    ).toString();
  }

  mineBlock(difficulty) {
    let nonce = this.nonce;
    let hash = this.hash;
    while (hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")) {
      nonce++;
      hash = SHA256(
        this.index +
          this.timestamp +
          JSON.stringify(this.transactions) +
          this.previousHash +
          nonce
      ).toString();
    }
    this.hash = hash;
    console.log(`Block mined: ${this.hash}`);
  }
}

class Blockchain {
  constructor() {
    this.chain = [this.createGenesisBlock()];
    this.difficulty = 2;
    this.pendingTransactions = [];
    this.miningReward = 100; // Reward for mining a block
  }

  createGenesisBlock() {
    return new Block("04/06/2025", "Genesis Block", "0");
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  minePendingTransactions(miningRewardAddress) {
    const block = new Block(
      Date.now(),
      this.pendingTransactions,
      this.getLatestBlock().hash
    );
    block.mineBlock(this.difficulty);
    console.log("Block successfully mined!");
    this.chain.push(block);
    this.pendingTransactions = [
      new Transaction(null, miningRewardAddress, this.miningReward),
    ];
  }

  createTransaction(transaction) {
    this.pendingTransactions.push(transaction);
  }

  getBalanceOfAddress(address) {
    let balance = 0;

    for (const block of this.chain) {
      for (const tx of block.transactions) {
        if (tx.fromAddress === address) {
          balance -= tx.amount;
        }
        if (tx.toAddress === address) {
          balance += tx.amount;
        }
      }
    }
    return balance;
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

pjcoin.createTransaction(new Transaction("address1", "address2", 100));
pjcoin.createTransaction(new Transaction("address2", "address1", 50));

console.log("\nStarting the miner...");
pjcoin.minePendingTransactions("miner-address");

console.log(
  `Balance of miner is ${pjcoin.getBalanceOfAddress("miner-address")}`
);

console.log("\nStarting the miner again...");
pjcoin.minePendingTransactions("miner-address");

console.log(
  `Balance of miner is ${pjcoin.getBalanceOfAddress("miner-address")}`
);
