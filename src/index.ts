import { inspect } from 'util';
import { Network } from './core';
import { Wallet } from './finance';

const w1 = new Wallet();
const w2 = new Wallet();

action();

async function action(): Promise<void> {
  await w1.pay(w2.key, 25, 10);
  await w2.mine();
  print();
}

function print(): void {
  console.log(inspect(w1.chain, false, null, true));
  console.log(inspect(w2.chain, false, null, true));
  console.log(`Is Network VALID?`, Network.instance.valid);
  console.table([w1.summary.balance, w2.summary.balance]);
}
