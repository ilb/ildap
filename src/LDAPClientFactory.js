const LdapClient = require('ldapjs-client');

//import Ldap from 'ldap-async';

/**
 * LDAP client factory fith connection reuse
 * TODO: register close hook
 * @type type
 */
class LDAPClientFactory {
  constructor() {
    this.connections = {};
  }

  close() {
    for (let [url, connection] of Object.entries(this.connections)) {
      connection.unbind();
    }
  }

  getLDAPClient(ldapClientConfig) {
    if (!this.connections[ldapClientConfig.url]) {
      this.connections[ldapClientConfig.url] = new LdapClient(ldapClientConfig);
    }
    return this.connections[ldapClientConfig.url];
  }
}

module.exports = LDAPClientFactory;
