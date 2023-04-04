const LDAPFactory = require('../src/LDAPFactory.js');

const expected = 'mysql://localhost/testapp';

const ldapFactory = new LDAPFactory('test/ldap.conf');

test('getInstance', async () => {
  const ldapResource = await ldapFactory.getLDAPResource();
  const resourceUrl = await ldapResource.lookup('com.iconicompany.apps.testapp.db');
  expect(resourceUrl).toBe(expected);
  expect(ldapFactory.isConfigured()).toBe(true);

  ldapFactory.close();
});

const ldapFactoryUnc = new LDAPFactory('/nonexistent.conf');

test('getInstanceUnc', async () => {
  expect(ldapFactoryUnc.isConfigured()).toBe(false);
});

process.env.LDAP_URL = 'ldaps://ldaptest:1636/dc=iconicompany,dc=com';
process.env.NODE_EXTRA_CA_CERTS = 'test/openldap/certs/ca.crt';
const ldapFactoryUrl = new LDAPFactory();

test('getInstance2+url', async () => {
  const ldapResource = await ldapFactoryUrl.getLDAPResource();
  const resourceUrl = await ldapResource.lookup('com.iconicompany.apps.testapp.db');
  expect(resourceUrl).toBe(expected);

  expect(ldapFactoryUrl.ldapConfig.base).toBe('dc=iconicompany,dc=com');

  ldapFactoryUrl.close();
});
