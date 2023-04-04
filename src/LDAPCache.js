import LDAPLastMod from './LDAPLastMod.js';
/**
 * LastMod based LdapCache
 * cache invalidated in getInstance call
 */
export default class LDAPCache {
  static async getInstance(ldapClient) {
    await LDAPCache.invalidateCache(ldapClient);
    return new LDAPCache();
  }

  static async invalidateCache(ldapClient) {
    const ldapLastMod = new LDAPLastMod(ldapClient);
    const lmdt = await ldapLastMod.getLastMod();
    // initialize static cache
    if (!LDAPCache.cache) {
      LDAPCache.cache = {};
    }
    // invalidate cache
    if (LDAPCache.cacheDate && lmdt && LDAPCache.cacheDate < lmdt) {
      LDAPCache.cache = {};
      LDAPCache.cacheDate = lmdt;
    }
  }

  constructor() {}

  /**
   * Get value from cache
   */
  get(name) {
    return LDAPCache.cache[name];
  }

  /**
   * set value to cache
   */
  set(name, value) {
    LDAPCache.cache[name] = value;
  }
}
