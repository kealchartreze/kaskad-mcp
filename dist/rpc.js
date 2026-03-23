"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rpcCall = rpcCall;
exports.getBlockNumber = getBlockNumber;
exports.ethCall = ethCall;
exports.padAddress = padAddress;
exports.decode = decode;
exports.callFunction = callFunction;
exports.safeCall = safeCall;
const ethers_1 = require("ethers");
const contracts_js_1 = require("./contracts.js");
let _reqId = 1;
/** Raw JSON-RPC call */
async function rpcCall(method, params) {
    const body = JSON.stringify({
        jsonrpc: "2.0",
        id: _reqId++,
        method,
        params,
    });
    const res = await fetch(contracts_js_1.RPC_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
        signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) {
        throw new Error(`RPC HTTP ${res.status}: ${await res.text()}`);
    }
    const json = (await res.json());
    if (json.error)
        throw new Error(`RPC error: ${json.error.message}`);
    return json.result;
}
/** eth_blockNumber → number */
async function getBlockNumber() {
    const hex = (await rpcCall("eth_blockNumber", []));
    return parseInt(hex, 16);
}
/** eth_call helper — returns raw hex result */
async function ethCall(to, data) {
    return (await rpcCall("eth_call", [{ to, data }, "latest"]));
}
/** Pad an address to 32-byte ABI word */
function padAddress(addr) {
    return "000000000000000000000000" + addr.replace(/^0x/, "").toLowerCase();
}
// Shared AbiCoder instance
const coder = ethers_1.AbiCoder.defaultAbiCoder();
/** Decode a single return value */
function decode(types, data) {
    return coder.decode(types, data);
}
/** Call a view function using ethers Interface */
async function callFunction(abi, address, funcName, args = []) {
    const iface = new ethers_1.Interface(abi);
    const encoded = iface.encodeFunctionData(funcName, args);
    const result = await ethCall(address, encoded);
    return iface.decodeFunctionResult(funcName, result);
}
/** Wrap any on-chain call with RPC-down error handling */
async function safeCall(fn) {
    try {
        return await fn();
    }
    catch (err) {
        return {
            error: "Igra testnet RPC unavailable",
            rpc: contracts_js_1.RPC_URL,
        };
    }
}
//# sourceMappingURL=rpc.js.map