import { existsSync, readFileSync } from 'fs';
import OpenLDAPConfig from './OpenLDAPConfig.js';
import URILDAPConfig from './URILDAPConfig.js';
import LDAPClientConfig from './LDAPClientConfig.js';
import LDAPClientFactory from './LDAPClientFactory.js';
import CacheableLDAPResource from './CacheableLDAPResource.js';
import createDebug from 'debug';

const debug = createDebug('node_ldap');
/**
 * LDAP facade with auto-configuration
 */
export default class LDAPFactory {
  constructor(ldapConfPath = '/etc/openldap/ldap.conf') {
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
  isConfigured() {
    return !!(this.ldapConfig && this.ldapConfig.isConfigured());
  }
  /**
   * lazy-initalization method to get ldapClient
   */
  getLDAPClient() {
    if (this.ldapClient === null) {
      const ldapClientConfig = new LDAPClientConfig(this.ldapConfig);
      this.ldapClient = this.ldapClientFactory.getLDAPClient(ldapClientConfig);
    }
    return this.ldapClient;
  }

  /**
   * get autoconfigured ldap resource
   */
  async getLDAPResource() {
    const ldapResource = await CacheableLDAPResource.getInstance(
      this.getLDAPClient(),
      this.ldapConfig.base
    );
    return ldapResource;
  }

  /**
   * closes open connections
   */
  close() {
    this.ldapClientFactory.close();
  }
}
