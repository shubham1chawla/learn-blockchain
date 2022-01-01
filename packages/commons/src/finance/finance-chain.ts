import { Chain } from '../core';
import { Transaction, TxBlock } from '.';

export class FinanceChain extends Chain<TxBlock, Transaction> {
  constructor(genesis?: TxBlock) {
    super();
    if (genesis) {
      this.blocks.push(genesis);
    }
  }

  get valid(): boolean {
    if (this.empty) {
      return true;
    }
    if (this.blocks[0].prevHash !== null) {
      console.error(`Chain[ID: ${this.id}] - Genesis Block prevHash NOT null!`);
      return false;
    }
    for (let i = 1; i < this.length; i++) {
      if (!this.blocks[i - 1].valid) {
        console.error(
          `Chain[ID: ${this.id}] - Block[ID: ${
            this.blocks[i - 1].id
          }]'s hash is invalid!`,
        );
        return false;
      }
      if (this.blocks[i - 1].hash !== this.blocks[i].prevHash) {
        console.error(
          `Chain[ID: ${this.id}] - Blocks ${i - 1} & ${i} hash mismatch!`,
        );
        return false;
      }
    }
    return true;
  }

  copy(): FinanceChain {
    return FinanceChain.copy(this);
  }

  newBlock(transactions: Transaction[]): TxBlock {
    return new TxBlock(this.last.hash, transactions);
  }

  static copy(chain: FinanceChain): FinanceChain {
    const copy = new FinanceChain();
    for (const block of chain.blocks) {
      copy.blocks.push(block.copy());
    }
    for (const tx of chain.pendings) {
      copy.pendings.push(tx.copy());
    }
    return copy;
  }
}
