process.env['ildap.objectClassGroup'] = 'posixGroup';
const path = require('path');
const { readFileSync } = require('fs');
const OpenLDAPConfig = require('../src/OpenLDAPConfig.js');
const LDAPClientConfig = require('../src/LDAPClientConfig.js');
const LDAPClientFactory = require('../src/LDAPClientFactory.js');
const LDAPResource = require('../src/LDAPResource.js');

const ldapConfPath = path.resolve('test/ldap.conf');

const ldapConfig = new OpenLDAPConfig(readFileSync(ldapConfPath, 'utf8'));

test('searchResource', async () => {
  const ldapClientFactory = new LDAPClientFactory();
  const ldapClient = ldapClientFactory.getLDAPClient(new LDAPClientConfig(ldapConfig));
  const ldapResource = new LDAPResource(ldapClient);
  const resourceUrl = await ldapResource.lookup(
    'com.iconicompany.apps.testapp.db',
    'dc=iconicompany,dc=com'
  );
  expect(resourceUrl).toBe('mysql://localhost/testapp');
  ldapClientFactory.close();
});

test('searchGroup', async () => {
  const ldapClientFactory = new LDAPClientFactory();
  const ldapClient = ldapClientFactory.getLDAPClient(new LDAPClientConfig(ldapConfig));
  const ldapResource = new LDAPResource(ldapClient);
  const resourceUrl = await ldapResource.lookup(
    'com.iconicompany.apps.testapp.users',
    'dc=iconicompany,dc=com'
  );
  expect(resourceUrl).toBe('com.iconicompany.apps.testapp.users');
  ldapClientFactory.close();
});
