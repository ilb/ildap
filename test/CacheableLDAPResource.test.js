const path = require('path');
const { readFileSync } = require('fs');
const OpenLDAPConfig = require('../src/OpenLDAPConfig.js');
const LDAPClientConfig = require('../src/LDAPClientConfig.js');
const LDAPClientFactory = require('../src/LDAPClientFactory.js');
const CacheableLDAPResource = require('../src/CacheableLDAPResource.js');

const ldapConfPath = path.resolve('test/ldap.conf');

const ldapConfig = new OpenLDAPConfig(readFileSync(ldapConfPath, 'utf8'));
const ldapClientFactory = new LDAPClientFactory();

const expected = 'mysql://localhost/testapp';

test('getInstance', async () => {
  const ldapClient = ldapClientFactory.getLDAPClient(new LDAPClientConfig(ldapConfig));
  let ldapResource = await CacheableLDAPResource.getInstance(ldapClient);

  let resourceUrl = await ldapResource.lookup(
    'com.iconicompany.apps.testapp.db',
    'dc=iconicompany,dc=com'
  );

  expect(resourceUrl).toBe(expected);

  expect(ldapResource.ldapResource.lookupCount).toBe(1);

  resourceUrl = await ldapResource.lookup(
    'com.iconicompany.apps.testapp.db',
    'dc=iconicompany,dc=com'
  );

  expect(resourceUrl).toBe(expected);

  // second call should be cached
  expect(ldapResource.ldapResource.lookupCount).toBe(1);

  resourceUrl = await ldapResource.lookup(
    'com.iconicompany.apps.testapp.ws',
    'dc=iconicompany,dc=com'
  );

  expect(ldapResource.ldapResource.lookupCount).toBe(2);

  ldapClientFactory.close();
});
