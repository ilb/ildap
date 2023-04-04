const { readFileSync } = require('fs');

/**
 * This class builds params structure for ldapjs-client from LDAPConfig structure
 */
class LDAPClientConfig {
  constructor(ldapConfig) {
    this.url = ldapConfig.uri[0];
    if (ldapConfig.caCert) {
      this.tlsOptions = { ca: readFileSync(ldapConfig.caCert) };
    }
  }
}

module.exports = LDAPClientConfig;
