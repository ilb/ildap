const fs = require('fs');

function getLdapConfPath() {
  if (process.env.LDAPCONF) {
    return process.env.LDAPCONF;
  }
  const ldapConfLocations = ['/etc/openldap/ldap.conf', '/etc/ldap/ldap.conf'];
  for (const ldapConfPath of ldapConfLocations) {
    if (fs.existsSync(ldapConfPath)) {
      return ldapConfPath;
    }
  }
  return null;
}

module.exports = { getLdapConfPath };
