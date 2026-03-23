"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProtocolInfo = getProtocolInfo;
const contracts_js_1 = require("../contracts.js");
function getProtocolInfo() {
    return {
        protocol: "Kaskad Protocol",
        version: "v1.0 (Aave v3 fork)",
        network: "Igra Galleon Testnet",
        chainId: contracts_js_1.CHAIN_ID,
        rpc: contracts_js_1.RPC_URL,
        contracts: {
            poolProxy: contracts_js_1.CONTRACTS.poolProxy,
            poolAddressesProvider: contracts_js_1.CONTRACTS.poolAddressesProvider,
            priceOracle: contracts_js_1.CONTRACTS.priceOracle,
            uiPoolDataProvider: contracts_js_1.CONTRACTS.uiPoolDataProvider,
            rewardsController: contracts_js_1.CONTRACTS.rewardsController,
            activityTracker: contracts_js_1.CONTRACTS.activityTracker,
        },
        supportedAssets: Object.entries(contracts_js_1.TOKENS).map(([symbol, address]) => ({
            symbol,
            address,
        })),
        documentation: "https://docs.kaskad.live",
        dapp: "https://testnet.kaskad.live",
        explorer: "https://explorer.galleon-testnet.igralabs.com",
    };
}
//# sourceMappingURL=getProtocolInfo.js.map