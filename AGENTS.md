# AGENTS Guide: Interacting With Kaskad Lending Testnet

Welcome to the Kaskad Lending integration guide for Agents. This document provides clear, **verified** examples of how you should collect protocol and user data, and how to execute on-chain transactions against the Aave V3 core contracts deployed on the Galleon testnet.

---

> **CRITICAL**: Galleon testnet silently drops transactions with insufficient gas. If a transaction disappears or `ethers.js` throws a timeout/revert without a reason, it is almost certainly a gas exception. The Galleon node incorrectly estimates `maxPriorityFeePerGas` at 500 Gwei, but the actual network minimum is **`2000 Gwei`**. Any transaction below `2000 Gwei` will be dropped.

## Network & Key Addresses

- **RPC URL:** `https://galleon-testnet.igralabs.com:8545`
- **Chain ID:** `38836`
- **Subgraph Endpoint:** `https://testnet.kaskad.live/subgraphs/name/galleon-testnet-aave-v3`
- **Pool Proxy (Aave V3):** `0xA1D84fc43f7F2D803a2d64dbBa4A90A9A79E3F24`
- **PoolAddressesProvider:** `0x9DB9797733FE5F734724Aa05D29Fa39563563Af5`
- **UiPoolDataProvider:** `0xbe38809914b552f295cD3e8dF2e77b3DA69cBC8b`

---

## 1. Reading Data (The Graph & Subgraph)

The Subgraph is the fastest way to get human-readable, aggregated metrics. We have fixed the Nginx proxy to allow any GraphQL IDE or native cURL request to successfully query the interface without strict CORS `Access-Control-Allow-Headers` rules blocking it.

**Endpoint:** `https://testnet.kaskad.live/subgraphs/name/galleon-testnet-aave-v3`

### Example: Fetch Active Reserves
```bash
curl -s -X POST -H 'Content-Type: application/json' \
 https://testnet.kaskad.live/subgraphs/name/galleon-testnet-aave-v3 \
 -d '{"query": "{ reserves(first: 5) { id symbol decimals totalLiquidity totalCurrentVariableDebt } }"}'
```

### Example: Fetch User's Active Position (Balances & Debts)
```bash
curl -s -X POST -H 'Content-Type: application/json' \
 https://testnet.kaskad.live/subgraphs/name/galleon-testnet-aave-v3 \
 -d '{"query": "{ users(where: { id: \"<USER_WALLET_LOWERCASE>\" }) { id borrowedReservesCount reserves { reserve { symbol decimals } currentATokenBalance currentTotalDebt } } }"}'
```

### Example: Fetch Recent Liquidations
```bash
curl -s -X POST -H 'Content-Type: application/json' \
 https://testnet.kaskad.live/subgraphs/name/galleon-testnet-aave-v3 \
 -d '{"query": "{ liquidationCalls(first: 5, orderBy: timestamp, orderDirection: desc) { id timestamp principalAmount collateralAmount principalReserve { symbol } collateralReserve { symbol } user { id } liquidator } }"}'
```

---

## 2. Reading Data (On-Chain UiPoolDataProvider)

When subgraph data lags or is unavailable, use `UiPoolDataProvider` to get real-time multi-asset metrics in a single RPC call.

### Get Protocol Reserves Info
```bash
cast call 0xbe38809914b552f295cD3e8dF2e77b3DA69cBC8b \
 "getReservesData(address)" 0x9DB9797733FE5F734724Aa05D29Fa39563563Af5 \
 --rpc-url https://galleon-testnet.igralabs.com:8545
```

### Get User Reserve Data (Balances, Borrows)
```bash
cast call 0xbe38809914b552f295cD3e8dF2e77b3DA69cBC8b \
 "getUserReservesData(address,address)" 0x9DB9797733FE5F734724Aa05D29Fa39563563Af5 <USER_WALLET> \
 --rpc-url https://galleon-testnet.igralabs.com:8545
```

---

## 3. Protocol Operations (Writing Data)

To interact with the protocol, you **MUST** ensure the `gas-limit` is ample and `gas-price` is hardcoded to at least `2000 Gwei`.

*Note: For the testnet, passing `--legacy` is often safer.*

### 3.1. Approving the Pool
```bash
cast send <USDC_ADDRESS> \
 "approve(address,uint256)" 0xA1D84fc43f7F2D803a2d64dbBa4A90A9A79E3F24 <AMOUNT> \
 --rpc-url https://galleon-testnet.igralabs.com:8545 \
 --private-key $PRIVATE_KEY \
 --legacy --gas-price 2000gwei
```

### 3.2. Supplying Assets
```bash
cast send 0xA1D84fc43f7F2D803a2d64dbBa4A90A9A79E3F24 \
 "supply(address,uint256,address,uint16)" <ASSET_ADDRESS> <AMOUNT> <YOUR_WALLET> 0 \
 --rpc-url https://galleon-testnet.igralabs.com:8545 \
 --private-key $PRIVATE_KEY \
 --legacy --gas-price 2000gwei \
 --gas-limit 500000
```

### 3.3. Borrowing Assets
```bash
cast send 0xA1D84fc43f7F2D803a2d64dbBa4A90A9A79E3F24 \
 "borrow(address,uint256,uint256,uint16,address)" <ASSET_ADDRESS> <AMOUNT> 2 0 <YOUR_WALLET> \
 --rpc-url https://galleon-testnet.igralabs.com:8545 \
 --private-key $PRIVATE_KEY \
 --legacy --gas-price 2000gwei \
 --gas-limit 500000
```

### 3.4. Repaying Debt
```bash
cast send 0xA1D84fc43f7F2D803a2d64dbBa4A90A9A79E3F24 \
 "repay(address,uint256,uint256,address)" <ASSET_ADDRESS> <AMOUNT> 2 <YOUR_WALLET> \
 --rpc-url https://galleon-testnet.igralabs.com:8545 \
 --private-key $PRIVATE_KEY \
 --legacy --gas-price 2000gwei \
 --gas-limit 500000
```

---

## 5. Tokenomics Context for Agents

Understanding KSKD tokenomics is critical for yield interpretation. APYs on Kaskad are a combination of real yield (interest from borrowers) and KSKD emission incentives. Without this context, agents will misread APY signals.

### KSKD Token
- **Token:** KSKD
- **FDV at launch:** $12.5M | **Price day 1:** $0.0125
- **Testnet address:** `0x2d17780a59044D49FeEf0AA9cEaB1B6e3161aFf7`
- **Oracle status (pre-TGE):** Static price — no live market data. APY calculations using KSKD price are indicative only.
- **Oracle status (post-TGE):** Live price feed via Kaskad oracle (median of 6 sources).

### Emission Schedule
- **Emission vault:** 39% of total KSKD supply, hardcoded — not governance-adjustable.
- **Duration:** 36 months from mainnet launch.
- **Epoch length:** 30 days (mainnet) / 4 days (testnet).
- **Implication:** Supply APY is partially emission-driven. As the vault depletes over 36 months, emission APY declines. Real yield (from borrower interest) must grow to compensate. An agent recommending "max supply KSKD" based on current APY must account for this decay curve.

### Emission Split (Governance-Adjustable)
- **Default split:** ~60% to suppliers / ~40% to borrowers (adjustable via DAO vote within bounded ranges).
- **Effect:** Higher supply split → higher supply APY → more TVL attraction. Higher borrow split → cheaper borrowing → more utilization. Both affect sustainable yield.

### Uptime Eligibility
- **Suppliers** must maintain position above a minimum TVL threshold for the full epoch to receive emissions (partial epochs yield proportionally less).
- **Borrowers** must maintain borrow position above minimum LTV threshold.
- **Implication:** Agents should not recommend opening/closing positions mid-epoch if the goal is emission capture — timing matters.

### DAO Revenue Routing
- **65% of protocol revenue** → DAO vault (hardcoded). DAO vote required for allocation (TVL incentives, burn, Kaspa core fund, etc.).
- **35%** → operational treasury.
- **Implication:** Protocol revenue is not automatically recycled to LPs — DAO governance determines how it flows back.

### Supported Assets at Launch
USDC, WETH, USDT, WBTC, stETH — KSKD is **not** listed at TGE due to thin liquidity risk. Agents should not attempt to supply/borrow KSKD as collateral in mainnet launch configuration.

---

## 4. Ethers.js & Frontend Agents

```typescript
const tx = await pool.supply(
  asset, amount, user, 0,
  {
    maxPriorityFeePerGas: 2_000_000_000_000n, // 2000 Gwei Minimum!
    maxFeePerGas: 2_001_000_000_000n,
    type: 2,
    gasLimit: 500_000n,
  }
);
await tx.wait();
```
