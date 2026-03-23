interface PositionEntry {
    asset: string;
    address: string;
    supplied: number;
    borrowed: number;
}
interface PositionResult {
    address: string;
    totalCollateralUSD: number;
    totalDebtUSD: number;
    availableBorrowsUSD: number;
    healthFactor: number | string;
    ltv: number;
    liquidationThreshold: number;
    positions: PositionEntry[];
}
export declare function getPosition(userAddress: string): Promise<PositionResult | {
    error: string;
    details?: string;
    rpc?: string;
}>;
export {};
//# sourceMappingURL=getPosition.d.ts.map