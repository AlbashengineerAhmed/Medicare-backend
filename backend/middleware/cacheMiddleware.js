import cache from '../utils/cache.js';
import logger from '../utils/logger.js';

/**
 * Cache middleware
 * This middleware caches responses for GET requests
 * @param {number} ttl - TTL in seconds
 * @returns {Function} - Express middleware
 */
export const cacheMiddleware = (ttl = 300) => {
  return (req, res, next) => {
    // Only cache GET requests
    if (req.method !== 'GET') {
      return next();
    }
    
    // Generate cache key
    const key = `__express__${req.originalUrl || req.url}`;
    
    // Check if response is in cache
    const cachedResponse = cache.get(key);
    
    if (cachedResponse) {
      logger.debug(`Cache hit for ${key}`);
      return res.json(cachedResponse);
    }
    
    logger.debug(`Cache miss for ${key}`);
    
    // Store original json method
    const originalJson = res.json;
    
    // Override json method
    res.json = function(body) {
      // Store response in cache
      cache.set(key, body, ttl);
      
      // Call original json method
      return originalJson.call(this, body);
    };
    
    next();
  };
};

/**
 * Clear cache middleware
 * This middleware clears the cache for a specific route
 * @param {string} route - Route to clear cache for
 * @returns {Function} - Express middleware
 */
export const clearCacheMiddleware = (route) => {
  return (req, res, next) => {
    // Generate cache key
    const key = `__express__${route || req.originalUrl || req.url}`;
    
    // Clear cache
    cache.del(key);
    logger.debug(`Cache cleared for ${key}`);
    
    next();
  };
};
