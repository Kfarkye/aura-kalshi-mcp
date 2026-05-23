export function getAuthHeaders() {
  const apiKey = process.env.KALSHI_API_KEY;
  if (!apiKey) {
    throw new Error("KALSHI_API_KEY environment variable is required.");
  }
  return {
    "Authorization": `Bearer ${apiKey}`,
    "Content-Type": "application/json"
  };
}
