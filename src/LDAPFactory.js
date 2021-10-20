import { existsSync, readFileSync } from 'fs';
import OpenLDAPConfig from './OpenLDAPConfig';
import URILDAPConfig from './URILDAPConfig';
import LDAPClientConfig from './LDAPClientConfig';
import LDAPClientFactory from './LDAPClientFactory';
import CacheableLDAPResource from './CacheableLDAPResource';
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
      debug(
        'configured using LDAP_URL (%s) isConfigured=%o',
        process.env.LDAP_URL,
        this.ldapConfig.isConfigured()
      );
    } else if (existsSync(ldapConfPath)) {
      //configure using openldap configuration file
      this.ldapConfig = new OpenLDAPConfig(readFileSync(ldapConfPath, 'utf8'));
      debug(
        'configured using ldap config file (%s) isConfigured=%o',
        ldapConfPath,
        this.ldapConfig.isConfigured()
      );
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
