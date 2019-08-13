# UniswapDEX

UniswapDEX is an an open source front-end interface for Uniswap protocol. The main purpose of this project is to allow users list ERC-20 tokens on uniswap exchange, buy, sell and transfer ERC-20 tokens and add/remove liquidity to uniswap liquidity pools. Basic statistics information of uniswap exchange are also provided.

This front-end interface is a SPA (Single Page Application) developed using vue.js and nuxt.js. Metamask wallet extension is required to submit the transactions.

- Website: https://uniswapdex.com
- Uniswap Protocol: uniswap.io
- Developer team: https://shardus.com/#team
- Report Issue: https://gitlab.com/shardus/uniswapdex/issues

## To Start Development

### Get an API key from etherscan.io

- Go to https://etherscan.io and get your API key
- Replace `etherscanApiKey` value in `config.js` file

### Clone the repo

```bash
$ git clone https://gitlab.com/shardus/uniswapdex.git
```

### Install Dependencies

```bash
$ npm install
```

### Serve with hot reload

```bash
$ npm run dev
```

Go to http://localhost:3000 to test the app

## To Deploy App to your own Remote server

### Method 1 (Build Project Locally)

build for production locally

```
$ npm run build
```

#### Upload generated `dist/` folder to your remote server

To copy `dist/` folder to remote server,

```
$ scp -r dist USERNAME@IP_ADDRESS:REMOTE_DIRECTORY
```

### Method 2 (Build Project on Remote Server)

Follow these steps on your remote server and run build command

1. Clone Repo
2. Change etherscan API key
3. Install dependencies

And then

```
$ npm run build
```

### Serve Static files on remote server

On your remote server, setup an http or https server to serve `dist/index.html` file.

Easiest way to setup a http server is to use `serve` npm package.

- Install `serve` package globally by running `npm install serve -g`
- Navigate to `dist/` directory
- Run `serve`
