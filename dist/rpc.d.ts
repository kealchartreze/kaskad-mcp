/** Raw JSON-RPC call */
export declare function rpcCall(method: string, params: unknown[]): Promise<unknown>;
/** eth_blockNumber → number */
export declare function getBlockNumber(): Promise<number>;
/** eth_call helper — returns raw hex result */
export declare function ethCall(to: string, data: string): Promise<string>;
/** Pad an address to 32-byte ABI word */
export declare function padAddress(addr: string): string;
/** Decode a single return value */
export declare function decode(types: string[], data: string): unknown[];
/** Call a view function using ethers Interface */
export declare function callFunction(abi: readonly string[], address: string, funcName: string, args?: unknown[]): Promise<unknown[]>;
/** Wrap any on-chain call with RPC-down error handling */
export declare function safeCall<T>(fn: () => Promise<T>): Promise<T | {
    error: string;
    rpc: string;
}>;
//# sourceMappingURL=rpc.d.ts.map