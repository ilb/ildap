const path = require('path');
const { readFileSync } = require('fs');
const OpenLDAPConfig = require('../src/OpenLDAPConfig.js');
const LDAPClientConfig = require('../src/LDAPClientConfig.js');
const LDAPClientFactory = require('../src/LDAPClientFactory.js');
const LDAPCache = require('../src/LDAPCache.js');
const ldapConfPath = path.resolve('test/ldap.conf');

const ldapConfig = new OpenLDAPConfig(readFileSync(ldapConfPath, 'utf8'));
const ldapClientConfig = new LDAPClientConfig(ldapConfig);
const ldapClientFactory = new LDAPClientFactory();
const ldapClient = ldapClientFactory.getLDAPClient(ldapClientConfig);

afterAll(async () => {
  ldapClientFactory.close();
});

test('getInstance', async () => {
  let ldapCache = await LDAPCache.getInstance(ldapClient);
  ldapCache.set('key', 'value1');
  ldapCache = await LDAPCache.getInstance(ldapClient);
  expect(ldapCache.get('key')).toBe('value1');
});
