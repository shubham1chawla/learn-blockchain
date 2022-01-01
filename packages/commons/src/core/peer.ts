import { createSign, generateKeyPairSync, KeyPairSyncResult } from 'crypto';
import { Block, Chain, Network, Record } from '.';

export abstract class Peer<
  C extends Chain<B, R>,
  B extends Block<R>,
  R extends Record,
> {
  private readonly keyPair: KeyPairSyncResult<string, string>;

  readonly chain: C;

  constructor() {
    this.keyPair = generateKeyPairSync('rsa', {
      modulusLength: 2048,
      publicKeyEncoding: {
        type: 'spki',
        format: 'pem',
      },
      privateKeyEncoding: {
        type: 'pkcs8',
        format: 'pem',
      },
    });
    let chain = this.network.getLatestChain();
    if (!chain) {
      chain = this.newChain();
    }
    this.chain = chain;
    this.network.register(this);
  }

  private get network(): Network<C, B, R> {
    return Network.instance as Network<C, B, R>;
  }

  protected get privateKey(): string {
    return this.keyPair.privateKey;
  }

  get key(): string {
    return this.keyPair.publicKey;
  }

  private sign(record: R): Buffer {
    const signer = createSign('sha256');
    signer.update(JSON.stringify(record)).end();
    return signer.sign(this.privateKey);
  }

  protected async publish(record: R): Promise<void> {
    return this.network
      .publish(record, this.key, this.sign(record))
      .then((pending) => {
        this.chain.pendings.push(pending);
        return;
      });
  }

  async mine(criterion?: (record: R) => boolean): Promise<void> {
    const records = this.select(criterion);
    return new Promise((resolve) => {
      setTimeout(async () => {
        let block = this.pow(this.chain.newBlock(records));
        block = await this.network.push(this.key, block);
        this.chain.push(block);
        resolve();
      });
    });
  }

  protected abstract newChain(): C;
  protected abstract pow(block: B): B;
  protected abstract select(criterion?: (record: R) => boolean): R[];
}
