import { CONTRACTS, TOKENS, RPC_URL, CHAIN_ID } from "../contracts.js";

export function getProtocolInfo() {
  return {
    protocol: "Kaskad Protocol",
    version: "v1.0 (Aave v3 fork)",
    network: "Igra Galleon Testnet",
    chainId: CHAIN_ID,
    rpc: RPC_URL,
    contracts: {
      poolProxy:             CONTRACTS.poolProxy,
      poolAddressesProvider: CONTRACTS.poolAddressesProvider,
      priceOracle:           CONTRACTS.priceOracle,
      uiPoolDataProvider:    CONTRACTS.uiPoolDataProvider,
      rewardsController:     CONTRACTS.rewardsController,
      activityTracker:       CONTRACTS.activityTracker,
    },
    supportedAssets: Object.entries(TOKENS).map(([symbol, address]) => ({
      symbol,
      address,
    })),
    documentation: "https://docs.kaskad.live",
    dapp: "https://testnet.kaskad.live",
    explorer: "https://explorer.galleon-testnet.igralabs.com",
  };
}
