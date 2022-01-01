import { createHash, createVerify } from 'crypto';
import { v4 } from 'uuid';

export abstract class Record {
  protected _id: string;

  constructor() {
    this._id = v4();
  }

  get id(): string {
    return this._id;
  }

  abstract copy(): Record;
}

export class PendingRecord<R extends Record> {
  constructor(
    readonly record: R,
    private readonly key: string,
    private readonly sign: Buffer,
  ) {
    if (!this.verify) {
      throw new Error(`Verification failed!`);
    }
  }

  get verify(): boolean {
    const verifyier = createVerify('sha256');
    verifyier.update(JSON.stringify(this.record));
    return verifyier.verify(this.key, this.sign);
  }

  copy(): PendingRecord<R> {
    return new PendingRecord(
      this.record.copy() as R,
      this.key,
      Buffer.from(this.sign),
    );
  }
}

export abstract class Block<R extends Record> {
  protected _id: string;
  nonce: number;

  constructor(readonly prevHash: string | null, readonly records: R[]) {
    this._id = v4();
    this.nonce = Math.round(Math.random() * 99999);
  }

  get id(): string {
    return this._id;
  }

  get hash(): string {
    const hash = createHash('sha256');
    hash.update(JSON.stringify(this)).end();
    return hash.digest('hex');
  }

  abstract copy(): Block<R>;
}
