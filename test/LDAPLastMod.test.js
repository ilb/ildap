const path = require('path');
const { readFileSync } = require('fs');
const OpenLDAPConfig = require('../src/OpenLDAPConfig.js');
const LDAPClientConfig = require('../src/LDAPClientConfig.js');
const LDAPClientFactory = require('../src/LDAPClientFactory.js');
const LDAPLastMod = require('../src/LDAPLastMod.js');
const ldapConfPath = path.resolve('test/ldap.conf');

const ldapConfig = new OpenLDAPConfig(readFileSync(ldapConfPath, 'utf8'));
const ldapClientFactory = new LDAPClientFactory();

test('getLastMod', async () => {
  const ldapClient = ldapClientFactory.getLDAPClient(new LDAPClientConfig(ldapConfig));
  const ldapLastMod = new LDAPLastMod(ldapClient);
  const lmdt = await ldapLastMod.getLastMod();
  expect(lmdt === null || lmdt.getTime() !== null).toBe(true);
  ldapClientFactory.close();
});
