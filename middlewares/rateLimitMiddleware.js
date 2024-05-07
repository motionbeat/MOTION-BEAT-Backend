import rateLimit from "express-rate-limit";

// Rate limiting middleware function
const createRateLimiter = (options = {}) => {
  const trustProxy = options.trustProxy || ['loopback', 'linklocal', 'uniquelocal'];

  const rateLimitOptions = {
    windowMs: 60 * 1000, // 1 minute
    max: 100, // maximum 100 requests per windowMs
    message: "Too many requests, please try again later.",
    trustProxy,
    ...options
  };

  return rateLimit(rateLimitOptions);
};

export default createRateLimiter;