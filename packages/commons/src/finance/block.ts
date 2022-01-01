import { Block } from '../core';
import { Transaction } from '.';

export class TxBlock extends Block<Transaction> {
  private static readonly REQ_LEN = 4;
  private static readonly REQ_STR = new Array(TxBlock.REQ_LEN).fill(0).join('');

  constructor(prevHash: string | null, transactions: Transaction[]) {
    super(prevHash, transactions);
  }

  get valid(): boolean {
    return this.hash.substr(0, TxBlock.REQ_LEN) === TxBlock.REQ_STR;
  }

  copy(): TxBlock {
    return TxBlock.copy(this);
  }

  static copy(block: TxBlock): TxBlock {
    const txCopies = block.records.map((tx) => tx.copy());
    const copy = new TxBlock(block.prevHash, txCopies);
    copy._id = block.id;
    copy.nonce = block.nonce;
    return copy;
  }
}
