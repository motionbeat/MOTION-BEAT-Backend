import rateLimit from "express-rate-limit";

// rate limit 설정
const rateLimitOption = {
  windowMs: 60 * 1000, // 1 minute
  max: 100, // maximum 100 requests per windowMs
  message: "Too many requests, please try again later.",
  handler(req, res, next) {
    req.headers['x-real-ip'] = req.ip;
    next();
  }
};

// Rate limiting middleware function
const createRateLimiter = (options = rateLimitOption) => {
  return rateLimit(options);
};

export default createRateLimiter;