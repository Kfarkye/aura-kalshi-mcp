export class RateLimiter {
  private requests: number[] = [];
  
  constructor(private maxRequests: number = 50, private windowMs: number = 60000) {}

  checkLimit(): void {
    const now = Date.now();
    this.requests = this.requests.filter(time => time > now - this.windowMs);
    if (this.requests.length >= this.maxRequests) {
      throw new Error("Rate limit exceeded for kalshi API.");
    }
    this.requests.push(now);
  }
}

export const globalLimiter = new RateLimiter();
