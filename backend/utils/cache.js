import NodeCache from 'node-cache';
import logger from './logger.js';

/**
 * Cache utility
 * This module provides a simple caching mechanism
 */
class Cache {
  /**
   * Cache instance
   * @type {NodeCache}
   */
  cache;

  /**
   * Constructor
   * @param {number} stdTTL - Standard TTL in seconds
   * @param {boolean} checkperiod - Check period in seconds
   */
  constructor(stdTTL = 300, checkperiod = 600) {
    this.cache = new NodeCache({
      stdTTL,
      checkperiod,
    });
    
    logger.info('Cache initialized');
  }

  /**
   * Get a value from the cache
   * @param {string} key - Cache key
   * @returns {any} - Cached value or undefined
   */
  get(key) {
    return this.cache.get(key);
  }

  /**
   * Set a value in the cache
   * @param {string} key - Cache key
   * @param {any} value - Value to cache
   * @param {number} ttl - TTL in seconds
   * @returns {boolean} - Whether the value was set
   */
  set(key, value, ttl = undefined) {
    return this.cache.set(key, value, ttl);
  }

  /**
   * Delete a value from the cache
   * @param {string} key - Cache key
   * @returns {number} - Number of deleted entries
   */
  del(key) {
    return this.cache.del(key);
  }

  /**
   * Check if a key exists in the cache
   * @param {string} key - Cache key
   * @returns {boolean} - Whether the key exists
   */
  has(key) {
    return this.cache.has(key);
  }

  /**
   * Get multiple values from the cache
   * @param {string[]} keys - Cache keys
   * @returns {Object} - Object with key-value pairs
   */
  mget(keys) {
    return this.cache.mget(keys);
  }

  /**
   * Set multiple values in the cache
   * @param {Object} keyValuePairs - Object with key-value pairs
   * @param {number} ttl - TTL in seconds
   * @returns {boolean} - Whether all values were set
   */
  mset(keyValuePairs, ttl = undefined) {
    return this.cache.mset(keyValuePairs.map(({ key, val }) => ({
      key,
      val,
      ttl,
    })));
  }

  /**
   * Flush the cache
   * @returns {void}
   */
  flush() {
    this.cache.flushAll();
    logger.info('Cache flushed');
  }

  /**
   * Get cache statistics
   * @returns {Object} - Cache statistics
   */
  stats() {
    return this.cache.getStats();
  }

  /**
   * Get all keys in the cache
   * @returns {string[]} - Cache keys
   */
  keys() {
    return this.cache.keys();
  }

  /**
   * Get the number of entries in the cache
   * @returns {number} - Number of entries
   */
  size() {
    return this.cache.keys().length;
  }
}

// Create a cache instance
const cache = new Cache();

export default cache;
