# Kalshi MCP Server

This is an automatically generated Model Context Protocol (MCP) server for Kalshi.

## Features Included
- **Auto-generated MCP wrapper** mapped from OpenAPI spec
- **Unsafe endpoint pruning** (mutations blocked by default)
- **Auth/Env setup** included
- **Zod validation schemas** integration ready
- **Rate limiting** built-in
- **Cloud Run Ready**: Runs an Express server exposing the MCP protocol via Server-Sent Events (SSE)

## Installation

```bash
npm install
npm run build
```

## Configuration

Auth secrets are pulled from the environment. Ensure you configure your environment variables (e.g. `KALSHI_API_KEY`) before connecting.

## Running the Server

```bash
npm start
```
The server will start on port 8080 (or the port defined by the `PORT` environment variable) and expose two endpoints for the MCP client:
- `GET /sse` (SSE connection)
- `POST /message` (Client requests)

## Usage with Cursor

Enable MCP in Cursor settings, choose "SSE" transport type, and enter the local or deployed URL (e.g. `http://localhost:8080/sse`).
