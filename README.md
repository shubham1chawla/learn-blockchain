# Learn Blockchain

<p align="left">
<img alt="License MIT" src="https://img.shields.io/badge/License-MIT-yellow.svg" />
<img alt="Contributor Covenant" src="https://img.shields.io/badge/Contributor%20Covenant-2.1-4baaaa.svg" />
<img alt="Contributions Welcome" src="https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat" />

### Motivation :star:

Being at the center of Web3.0, Blockchain is more than just a secure ledger; it's a decentralized paradigm that requires looking at the internet in a whole new way. As a passionate developer, understanding it on a micro-level allows me to get a taste of what is out there and get myself future-ready! 🙌

#### Features

- **All in Typescript**
  Because [TypeScript](https://www.typescriptlang.org/) is awesome, and types are important 😃

- **Eslint + Prettier**
  This project uses [Prettier](https://prettier.io/) for beautiful code ❤️

- **Husky**
  Project uses automation powered by [Husky](https://typicode.github.io/husky/#/) in order to prevent you from pushing ugly code 😁

**Please leave a :star: as motivation if you liked the idea :smile:**

### 📖 Contents

- [Architecture](#architecture)
- [Getting started](#getting-started)
- [How to Contribute](#how-to-contribute)
- [License](#license)

### 🏭 <a id="architecture">Architecture</a>

The source code is separated into <i>core</i> and <i>finance</i> (for now); core classes are all abstract classes that define the rules and workflow of Blockchain, and finance classes are a particular implementation extending core classes. This architecture allows for other implementations as well.

```
learn-blockchain
├── .husky
├── src
│   ├── core
│   │   ├── block.ts
│   │   ├── chain.ts
│   │   ├── index.ts
│   │   ├── network.ts
│   │   └── peer.ts
│   ├── finance
│   │   ├── block.ts
│   │   ├── finance-chain.ts
│   │   ├── index.ts
│   │   ├── transaction.ts
│   │   └── wallet.ts
│   └── index.ts
├── .gitignore
├── .prettierignore
├── .prettierrc.json
├── package.json
├── CODE_OF_CONDUCT.md
├── LICENSE
├── README.md
├── tsconfig.json
└── yarn.lock
```

### 🏃 <a id="getting-started">Getting Started</a>

Run the `npm run start` or `yarn start` command, which will trigger a clean build of the project. Since the project uses TypeScript, the source code complies, and then the `/dist/index.js` file is executed. This file showcase an example of finance implementation.

<i>
Feel free to open a new issue if you're facing any problem 🙋
</i>

### 👏 <a id="how-to-contribute">How to Contribute</a>

Contributions are welcome as always, before submitting a new PR please make sure to open a new
issue so community members can discuss.

Additionally you might find existing open issues which can helps with improvements.

This project follows standard [code of conduct](/CODE_OF_CONDUCT.md) so that you can understand what actions will and will not be tolerated.

### 📄 <a id="license">License</a>

This project is MIT licensed, as found in the [LICENSE](/LICENSE)

<p>
  <p  style="margin: 0">  
    Built and maintained with 🌮 by <a href="https://www.linkedin.com/in/shubham1chawla/">Shubham</a>
  </p>
</p>
