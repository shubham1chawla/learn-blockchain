import { Block, Chain, Peer, PendingRecord, Record } from '.';

export class Network<
  C extends Chain<B, R>,
  B extends Block<R>,
  R extends Record,
> {
  static readonly instance = new Network();

  private readonly peers: Set<Peer<C, B, R>> = new Set();

  private constructor() {}

  get valid(): boolean {
    if (!this.peers.size) {
      return true;
    }
    let valid = true;
    let hash = null;
    let length = null;
    for (const { chain } of Array.from(this.peers)) {
      valid = valid && chain.valid;
      if (!hash) {
        hash = chain.last.hash;
        length = chain.length;
      }
      if (!valid || hash !== chain.last.hash || length !== chain.length) {
        return false;
      }
    }
    return true;
  }

  register(peer: Peer<C, B, R>): void {
    if (peer) {
      this.peers.add(peer);
    }
  }

  getLatestChain(): C | null {
    if (!this.valid) {
      throw new Error(`Peers are not in sync!`);
    }
    if (!this.peers.size) {
      return null;
    }
    const peer = this.peers.values().next().value as Peer<C, B, R>;
    return peer.chain.copy() as C;
  }

  async publish(
    record: R,
    key: string,
    sign: Buffer,
  ): Promise<PendingRecord<R>> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const pending = new PendingRecord(record, key, sign);
        this.peers.forEach((peer) => {
          if (key !== peer.key) {
            peer.chain.pendings.push(pending.copy());
          }
        });
        resolve(pending.copy());
      });
    });
  }

  async push(key: string, block: B): Promise<B> {
    return new Promise((resolve) => {
      this.peers.forEach((peer) => {
        if (key !== peer.key) {
          peer.chain.push(block.copy() as B);
        }
      });
      resolve(block.copy() as B);
    });
  }
}
