
// == AURA Artifact Envelope ==
// Server: Kalshi
// Generated at: 2026-05-23T08:31:46.821Z
// This file is signed by the AURA code generation system.
import express from "express";
import cors from "cors";
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
import { getAuthHeaders } from "./auth.js";
import { globalLimiter } from "./rate-limit.js";

const app = express();
app.use(cors());
app.use(express.json());

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
    path: "/markets",
    method: "GET",
    paramLocations: {"limit":"query"},
    inputSchema: z.object({
      "limit": z.number().optional()
    })
  },
  {
    name: "getPortfolio",
    description: "Get user portfolio",
    path: "/portfolio",
    method: "GET",
    paramLocations: {},
    inputSchema: z.object({
      
    })
  }
];

const BASE_URL = "";

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
        const tool = tools.find((t: any) => t.name === request.params.name);
        if (!tool) throw new Error("Tool not found");

        // --- GOVERNANCE ENGINE CHECKS ---
        // Policy: Global Mutation Guard
        if (["post","put","patch","delete"].includes((tool.method || "").toLowerCase()) || (tool.name || "").toLowerCase().match(/create|delete|update|submit|order|trade|cancel|transfer|withdraw|deposit/) || (tool.path || "").toLowerCase().includes("/portfolio/orders")) {
            throw new Error("Governance policy violation: Global Mutation Guard - Action Blocked/Pruned.");
        }
        // --------------------------------

        let finalPath = tool.path;
        const queryParams = new URLSearchParams();
        let bodyPayload = undefined;
        
        const args = (request.params.arguments || {}) as Record<string, any>;
        for (const [key, val] of Object.entries(args)) {
            const loc = tool.paramLocations[key];
            if (loc === "path") {
                finalPath = finalPath.replace("{" + key + "}", encodeURIComponent(String(val)));
            } else if (loc === "query") {
                queryParams.append(key, String(val));
            } else if (key === "body") {
                bodyPayload = val;
            }
        }
        
        const qStr = queryParams.toString();
        const fullUrl = BASE_URL + finalPath + (qStr ? "?" + qStr : "");
        
        console.log(`[MCP] Calling ${tool.method} ${fullUrl}`);
        const res = await fetch(fullUrl, {
            method: tool.method,
            headers: { ...headers },
            body: bodyPayload ? JSON.stringify(bodyPayload) : undefined
        });
        
        if (!res.ok) {
            const errText = await res.text();
            throw new Error(`API returned ${res.status}: ${errText}`);
        }
        
        let data;
        let responseText;
        try {
            data = await res.json();
            responseText = JSON.stringify(data, null, 2);
        } catch {
            responseText = await res.text();
        }

        return {
            content: [{ type: "text", text: responseText }]
        };
    } catch (e: any) {
        return {
            content: [{ type: "text", text: `Error: ${e.message}` }],
            isError: true
        };
    }
});

let transport: SSEServerTransport;

app.get("/sse", async (req, res) => {
    console.log("New SSE connection established");
    transport = new SSEServerTransport("/message", res);
    await server.connect(transport);
});

app.post("/message", async (req, res) => {
    if (!transport) {
        res.status(400).send("No active SSE connection");
        return;
    }
    await transport.handlePostMessage(req, res);
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, "0.0.0.0", () => {
    console.log(`Kalshi MCP Server running on port ${PORT} (Cloud Run Ready)`);
});
