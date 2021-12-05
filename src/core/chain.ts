import { v4 } from 'uuid';
import { Record, Block, PendingRecord } from '.';

export abstract class Chain<B extends Block<R>, R extends Record> {
  readonly id: string;
  readonly blocks: B[];
  readonly pendings: PendingRecord<R>[];

  constructor() {
    this.id = v4();
    this.blocks = [];
    this.pendings = [];
  }

  get length(): number {
    return this.blocks.length;
  }

  get empty(): boolean {
    return !this.length;
  }

  get last(): B {
    return this.blocks[this.length - 1];
  }

  push(block: B): void {
    let length = this.pendings.length;
    if (length) {
      const ids = new Set(block.records.map((r) => r.id));
      while (length--) {
        const pending = this.pendings.shift();
        if (pending && !ids.has(pending.record.id)) {
          this.pendings.push(pending);
        }
      }
    }
    this.blocks.push(block);
  }

  abstract get valid(): boolean;
  abstract copy(): Chain<B, R>;
  abstract newBlock(records: R[]): B;
}
