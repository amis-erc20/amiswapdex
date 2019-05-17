# web-wallet

> &#34;web wallet&#34;

## Build Setup

```bash
# install dependencies
$ npm install

# serve with hot reload at localhost:3000
$ npm run dev

# build for production and launch server
$ npm run build
$ npm start

# generate static project
$ npm run generate
```

#Todo

http://192.168.99.53:3000

nuxt --hostname 192.168.99.53 --port 3000

TODO:

- iOS copy function
- show pending transaction after submitted to network
- get internal tx list

- estimateGas not working make a lot of problems
- Detect that the current account has changed for metamask


let account = getAccount();
let accountInterval = setInterval(() => {
  if (getAccount() !== account) {
    account = getAccount();
    // update UI, state, pull data
    updateEverything();
  }
}, 1000);
