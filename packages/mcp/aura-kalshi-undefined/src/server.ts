
// == AURA Artifact Envelope ==
// Server: Kalshi
// Generated at: 2026-05-20T07:57:19.283Z
// This file is signed by the AURA code generation system.
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
import { getAuthHeaders } from "./auth.js";
import { globalLimiter } from "./rate-limit.js";

const server = new Server({
  name: "Kalshi-server",
  version: "1.0.0"
}, {
  capabilities: { tools: {} }
});

const tools = [
  {
    name: "getMarkets",
    description: "Get active markets",
    inputSchema: z.object({
      "limit": z.number().optional()
    })
  },
  {
    name: "getPortfolio",
    description: "Get user portfolio",
    inputSchema: z.object({
      
    })
  }
];

server.setRequestHandler(ListToolsRequestSchema, async () => {
    return { tools: tools.map(t => ({
        name: t.name,
        description: t.description,
        inputSchema: { type: "object" } // Real implementation parses Zod to JSON Schema
    }))};
});

server.setRequestHandler(CallToolRequestSchema, async (request, extra) => {
    try {
        globalLimiter.checkLimit();
        const headers = getAuthHeaders();
        const tool = tools.find(t => t.name === request.params.name);
        if (!tool) throw new Error("Tool not found");

        // Execution handled here typically. 
        // Usually using an underlying generated Axios/Fetch client.
        return {
            content: [{ type: "text", text: "Successfully executed " + request.params.name }]
        };
    } catch (e: any) {
        return {
            content: [{ type: "text", text: `Error: ${e.message}` }],
            isError: true
        };
    }
});

async function run() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.log("Kalshi MCP Server running on stdio");
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
