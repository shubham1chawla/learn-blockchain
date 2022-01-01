import { Record } from '../core';

export class Transaction extends Record {
  protected _ts: number;

  constructor(
    readonly payor: string,
    readonly payee: string,
    readonly amount: number,
    readonly fee: number = 0,
  ) {
    super();
    this._ts = Date.now();
  }

  get timestamp(): number {
    return this._ts;
  }

  get id(): string {
    return this._id;
  }

  copy(): Transaction {
    return Transaction.copy(this);
  }

  static copy(tx: Transaction): Transaction {
    const copy = new Transaction(tx.payor, tx.payee, tx.amount, tx.fee);
    copy._id = tx.id;
    copy._ts = tx.timestamp;
    return copy;
  }
}

export class FeeTransaction extends Transaction {
  constructor(
    readonly parentId: string,
    payor: string,
    payee: string,
    amount: number,
  ) {
    super(payor, payee, amount, 0);
  }

  copy(): FeeTransaction {
    return FeeTransaction.copy(this);
  }

  static copy(tx: FeeTransaction): FeeTransaction {
    const copy = new FeeTransaction(tx.parentId, tx.payor, tx.payee, tx.amount);
    copy._id = tx.id;
    copy._ts = tx.timestamp;
    return copy;
  }
}
