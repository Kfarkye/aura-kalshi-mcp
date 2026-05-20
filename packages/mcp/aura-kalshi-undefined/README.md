# Kalshi MCP Server

This is an automatically generated Model Context Protocol (MCP) server for Kalshi.

## Features Included
- **Auto-generated MCP wrapper** mapped from OpenAPI spec
- **Unsafe endpoint pruning** (mutations blocked by default)
- **Auth/Env setup** included
- **Zod validation schemas** integration ready
- **Rate limiting** built-in
- **Config ready** for Cursor & Claude Desktop

## Installation

```bash
npm install
npm run build
```

## Configuration

Auth secrets are pulled from the environment. Ensure you configure your environment variables (e.g. `KALSHI_API_KEY`) before connecting.

## Usage with Cursor

Enable MCP in Cursor settings and point it to the built `dist/server.js` file along with the necessary environment variables.

## Usage with Claude Desktop

Add this to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "Kalshi": {
      "command": "node",
      "args": ["/absolute/path/to/dist/server.js"],
      "env": {
        "KALSHI_API_KEY": "your-key-here"
      }
    }
  }
}
```
