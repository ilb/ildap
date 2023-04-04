const { existsSync, readFileSync } = require('fs');
const OpenLDAPConfig = require('./OpenLDAPConfig.js');
const URILDAPConfig = require('./URILDAPConfig.js');
const LDAPClientConfig = require('./LDAPClientConfig.js');
const LDAPClientFactory = require('./LDAPClientFactory.js');
const CacheableLDAPResource = require('./CacheableLDAPResource.js');
const createDebug = require('debug');

const debug = createDebug('node_ldap');
/**
 * LDAP facade with auto-configuration
 */
function LDAPFactory(ldapConfPath = '/etc/openldap/ldap.conf') {
  this.ldapConfig = null;
  if (process.env.LDAP_URL) {
    //configure using LDAP_URL variable if set
    this.ldapConfig = new URILDAPConfig(process.env.LDAP_URL, process.env.NODE_EXTRA_CA_CERTS);
    debug('configured using LDAP_URL', this.ldapConfig);
  } else if (existsSync(ldapConfPath)) {
    //configure using openldap configuration file
    this.ldapConfig = new OpenLDAPConfig(readFileSync(ldapConfPath, 'utf8'));
    debug('configured using ldap config file', ldapConfPath, this.ldapConfig);
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
