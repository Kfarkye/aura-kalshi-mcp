import * as crypto from "crypto";

export function getAuthHeaders(method: string, path: string) {
  const keyId = process.env.KALSHI_API_KEY_ID;
  const privateKey = process.env.KALSHI_PRIVATE_KEY;
  if (!keyId || !privateKey) {
    throw new Error("KALSHI_API_KEY_ID and KALSHI_PRIVATE_KEY environment variables are required.");
  }
  const timestamp = Date.now().toString();
  const msgString = timestamp + method + path;
  
  const sign = crypto.createSign('SHA256');
  sign.update(msgString);
  sign.end();
  const signature = sign.sign(privateKey, 'base64');
  
  return {
    "KALSHI-ACCESS-KEY": keyId,
    "KALSHI-ACCESS-SIGNATURE": signature,
    "KALSHI-ACCESS-TIMESTAMP": timestamp,
    "Content-Type": "application/json"
  };
}
