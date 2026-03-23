"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_js_1 = require("@modelcontextprotocol/sdk/server/index.js");
const stdio_js_1 = require("@modelcontextprotocol/sdk/server/stdio.js");
const types_js_1 = require("@modelcontextprotocol/sdk/types.js");
const getMarkets_js_1 = require("./tools/getMarkets.js");
const getPosition_js_1 = require("./tools/getPosition.js");
const getProtocolInfo_js_1 = require("./tools/getProtocolInfo.js");
// ─── Tool definitions ──────────────────────────────────────────────────────────
const TOOLS = [
    {
        name: "getMarkets",
        description: "Returns the current state of all Kaskad Protocol lending markets on the Igra Galleon Testnet. " +
            "Includes supply/borrow APY, total supply/borrow in USD, utilization rate, and available liquidity for each asset.",
        inputSchema: {
            type: "object",
            properties: {},
            required: [],
        },
    },
    {
        name: "getPosition",
        description: "Returns a wallet's current lending/borrowing position on Kaskad Protocol. " +
            "Includes total collateral, total debt, available borrows, health factor, and per-asset breakdown.",
        inputSchema: {
            type: "object",
            properties: {
                address: {
                    type: "string",
                    description: "Ethereum wallet address (0x...)",
                },
            },
            required: ["address"],
        },
    },
    {
        name: "getProtocolInfo",
        description: "Returns static metadata about Kaskad Protocol: network info, contract addresses, supported assets, and documentation links.",
        inputSchema: {
            type: "object",
            properties: {},
            required: [],
        },
    },
];
// ─── Server setup ──────────────────────────────────────────────────────────────
const server = new index_js_1.Server({
    name: "kaskad-mcp",
    version: "1.0.0",
}, {
    capabilities: {
        tools: {},
    },
});
// List tools handler
server.setRequestHandler(types_js_1.ListToolsRequestSchema, async () => {
    return { tools: TOOLS };
});
// Call tool handler
server.setRequestHandler(types_js_1.CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;
    try {
        let result;
        switch (name) {
            case "getMarkets": {
                result = await (0, getMarkets_js_1.getMarkets)();
                break;
            }
            case "getPosition": {
                const { address } = (args ?? {});
                if (!address) {
                    return {
                        content: [
                            {
                                type: "text",
                                text: JSON.stringify({ error: "Missing required parameter: address" }),
                            },
                        ],
                    };
                }
                result = await (0, getPosition_js_1.getPosition)(address);
                break;
            }
            case "getProtocolInfo": {
                result = (0, getProtocolInfo_js_1.getProtocolInfo)();
                break;
            }
            default:
                return {
                    content: [
                        {
                            type: "text",
                            text: JSON.stringify({ error: `Unknown tool: ${name}` }),
                        },
                    ],
                    isError: true,
                };
        }
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify(result, null, 2),
                },
            ],
        };
    }
    catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify({ error: message }),
                },
            ],
            isError: true,
        };
    }
});
// ─── Start ─────────────────────────────────────────────────────────────────────
async function main() {
    const transport = new stdio_js_1.StdioServerTransport();
    await server.connect(transport);
    // MCP servers communicate via stdio — no console output expected
    process.stderr.write("[kaskad-mcp] Server started on stdio\n");
}
main().catch((err) => {
    process.stderr.write(`[kaskad-mcp] Fatal error: ${err}\n`);
    process.exit(1);
});
//# sourceMappingURL=index.js.map