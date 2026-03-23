interface MarketData {
    asset: string;
    address: string;
    supplyAPY: number;
    borrowAPY: number;
    totalSupplyUSD: number;
    totalBorrowUSD: number;
    utilizationRate: number;
    liquidityAvailableUSD: number;
}
interface MarketsResult {
    protocol: string;
    network: string;
    chainId: number;
    blockNumber: number;
    markets: MarketData[];
}
export declare function getMarkets(): Promise<MarketsResult | {
    error: string;
    rpc: string;
}>;
export {};
//# sourceMappingURL=getMarkets.d.ts.map