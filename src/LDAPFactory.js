const { existsSync, readFileSync } = require('fs');
const OpenLDAPConfig = require('./OpenLDAPConfig.js');
const URILDAPConfig = require('./URILDAPConfig.js');
const LDAPClientConfig = require('./LDAPClientConfig.js');
const LDAPClientFactory = require('./LDAPClientFactory.js');
const CacheableLDAPResource = require('./CacheableLDAPResource.js');
const createDebug = require('debug');
const { getLdapConfPath } = require('./defaults.js');

const debug = createDebug('ildap');

/**
 * LDAP facade with auto-configuration
 */
function LDAPFactory(ldapConfPath) {
  this.ldapConfig = null;
  if (process.env.LDAPURI) {
    //configure using LDAPURI variable if set
    this.ldapConfig = new URILDAPConfig(
      process.env.LDAPURI,
      process.env.LDAPBASE,
      process.env.LDAPTLS_CACERT
    );
    debug('configured using LDAPURI', this.ldapConfig);
  } else {
    ldapConfPath = ldapConfPath || getLdapConfPath();
    if (ldapConfPath && existsSync(ldapConfPath)) {
      //configure using openldap configuration file
      this.ldapConfig = new OpenLDAPConfig(readFileSync(ldapConfPath, 'utf8'));
      debug('configured using ldap config file', ldapConfPath, this.ldapConfig);
    }
  }
  this.ldapClientFactory = new LDAPClientFactory();
  this.ldapClient = null;
}

/**
 * check if ldapFactory configured
 */
LDAPFactory.prototype.isConfigured = function () {
  return !!(this.ldapConfig && this.ldapConfig.isConfigured());
};
/**
 * lazy-initalization method to get ldapClient
 */
LDAPFactory.prototype.getLDAPClient = function () {
  if (this.ldapClient === null) {
    const ldapClientConfig = new LDAPClientConfig(this.ldapConfig);
    this.ldapClient = this.ldapClientFactory.getLDAPClient(ldapClientConfig);
  }
  return this.ldapClient;
};

/**
 * get autoconfigured ldap resource
 */
LDAPFactory.prototype.getLDAPResource = async function () {
  const ldapResource = await CacheableLDAPResource.getInstance(
    this.getLDAPClient(),
    this.ldapConfig.base
  );
  return ldapResource;
};

/**
 * closes open connections
 */
LDAPFactory.prototype.close = function () {
  this.ldapClientFactory.close();
};

module.exports = LDAPFactory;
