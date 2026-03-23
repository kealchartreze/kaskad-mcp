# kaskad-mcp

MCP (Model Context Protocol) server for **Kaskad Protocol** — reads live on-chain state from the Igra Galleon Testnet and exposes it via three MCP tools.

## Quick Start

```bash
npm install
npm run build
node dist/index.js
```

## Tools

### `getMarkets`
Returns current state of all lending markets.

```json
{
  "protocol": "Kaskad Protocol",
  "network": "Igra Galleon Testnet",
  "chainId": 38836,
  "blockNumber": 5067345,
  "markets": [
    {
      "asset": "USDC",
      "address": "0xb19b36b1456E65E3A6D514D3F715f204BD59f431",
      "supplyAPY": 0.042,
      "borrowAPY": 0.071,
      "totalSupplyUSD": 45000,
      "totalBorrowUSD": 28000,
      "utilizationRate": 0.62,
      "liquidityAvailableUSD": 17000
    }
  ]
}
```

### `getPosition`
Returns a wallet's current lending/borrowing position.

Input: `{ "address": "0x..." }`

```json
{
  "address": "0x...",
  "totalCollateralUSD": 5000,
  "totalDebtUSD": 1200,
  "availableBorrowsUSD": 2800,
  "healthFactor": 2.45,
  "positions": [
    { "asset": "USDC", "supplied": 5000, "borrowed": 1200 }
  ]
}
```

### `getProtocolInfo`
Static metadata: network info, contract addresses, supported assets, docs.

## Network

| Property | Value |
|----------|-------|
| Chain ID | 38836 |
| Network  | Igra Galleon Testnet |
| RPC | https://galleon-testnet.igralabs.com:8545 |
| Explorer | https://explorer.galleon-testnet.igralabs.com |
| dApp | https://testnet.kaskad.live |

## MCP Client Config

Add to your MCP client config (e.g. Claude Desktop `claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "kaskad": {
      "command": "node",
      "args": ["C:/Users/jackb/.openclaw/workspace/research/kaskad-mcp/dist/index.js"]
    }
  }
}
```

## Contract Addresses

| Contract | Address |
|----------|---------|
| poolProxy | `0xA1D84fc43f7F2D803a2d64dbBa4A90A9A79E3F24` |
| poolAddressesProvider | `0x9DB9797733FE5F734724Aa05D29Fa39563563Af5` |
| priceOracle | `0x4f29f479D3e6c41aD3fC8C7c8D6f423Cb2784b8e` |
| uiPoolDataProvider | `0xbe38809914b552f295cD3e8dF2e77b3DA69cBC8b` |
| USDC | `0xb19b36b1456E65E3A6D514D3F715f204BD59f431` |
| WBTC | `0xA7CEd4eFE5C3aE0e5C26735559A77b1e38950a14` |
| WETH | `0xe1Aa25618fA0c7A1CFDab5d6B456af611873b629` |
| WIKAS | `0xe1DA8919f262Ee86f9BE05059C9280142CF23f48` |
| KSKD | `0xd884991BbaB6d5644fFE29000088bbB359AD5e9e` |
