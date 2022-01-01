import { Peer } from '../core';
import { Transaction, FinanceChain, FeeTransaction, TxBlock } from '.';

export type AmountNumber = { amount: number; number: number };
export type CSummary = { credits: AmountNumber };
export type DSummary = { debits: AmountNumber };
export type CDSummary = CSummary & DSummary;

export class Summary {
  readonly confirmed: CDSummary;
  readonly pending: DSummary;

  constructor() {
    this.confirmed = Summary.default;
    this.pending = Summary.default;
  }

  get balance(): number {
    const confirmed =
      this.confirmed.credits.amount - this.confirmed.debits.amount;
    return confirmed - this.pending.debits.amount;
  }

  static get default(): CDSummary {
    return {
      credits: {
        amount: 0,
        number: 0,
      },
      debits: {
        amount: 0,
        number: 0,
      },
    };
  }
}

export class Wallet extends Peer<FinanceChain, TxBlock, Transaction> {
  private static readonly SYSTEM: string = 'SYSTEM';
  private static readonly INIT_AMOUNT: number = 100;
  private static readonly ATTEMPTS: number = 100000000;

  protected newChain(): FinanceChain {
    return new FinanceChain(
      this.pow(
        new TxBlock(null, [
          new Transaction(Wallet.SYSTEM, this.key, Wallet.INIT_AMOUNT),
        ]),
      ),
    );
  }

  protected pow(block: TxBlock): TxBlock {
    let attempts = Wallet.ATTEMPTS;
    while (--attempts) {
      if (block.valid) {
        return block;
      }
      block.nonce += 1;
    }
    throw new Error(`All ${Wallet.ATTEMPTS} attempts to mine exhausted!`);
  }

  protected select(
    criterion: (tx: Transaction) => boolean = () => true,
  ): Transaction[] {
    let length = this.chain.pendings.length;
    if (!length) {
      console.warn('No pending transactions!');
      return [];
    }
    const transactions = this.chain.pendings
      .filter((p) => p.verify && criterion(p.record))
      .map((p) => p.record);
    transactions.push(
      ...transactions
        .filter((tx) => tx.fee > 0 && tx.payor !== this.key)
        .map((tx) => new FeeTransaction(tx.id, tx.payor, this.key, tx.fee)),
    );
    return transactions;
  }

  get summary(): Summary {
    const s = new Summary();
    this.chain.blocks.forEach((b) => {
      for (const tx of b.records) {
        if (tx.payee === this.key) {
          s.confirmed.credits.amount += tx.amount;
          s.confirmed.credits.number += 1;
        }
        if (tx.payor === this.key) {
          s.confirmed.debits.amount += tx.amount;
          s.confirmed.debits.number += 1;
        }
      }
    });
    this.chain.pendings.forEach((p) => {
      if (p.record.payor === this.key) {
        s.pending.debits.amount += p.record.amount + p.record.fee;
        s.pending.debits.number += 1 + (p.record.fee > 0 ? 1 : 0);
      }
    });
    return s;
  }

  pay(payee: string, amount: number, fee: number = 0): Promise<void> {
    if (amount <= 0 || fee < 0) {
      throw new Error('Invalid transaction amount!');
    }
    const { balance } = this.summary;
    if (balance < amount + fee) {
      throw new Error(`Insufficient Balance: ${balance}`);
    }
    return this.publish(new Transaction(this.key, payee, amount, fee));
  }
}
