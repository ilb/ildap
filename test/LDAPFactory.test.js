const LDAPFactory = require('../src/LDAPFactory.js');

test('getInstance', async () => {
  const ldapFactory = new LDAPFactory('test/ldap.conf');
  const ldapResource = await ldapFactory.getLDAPResource();
  const resourceUrl = await ldapResource.lookup('com.iconicompany.apps.testapp.db');
  expect(resourceUrl).toBe('mysql://localhost/testapp');
  expect(ldapFactory.isConfigured()).toBe(true);
  ldapFactory.close();
});

test('getInstanceUnc', async () => {
  const ldapFactoryUnc = new LDAPFactory('/nonexistent.conf');
  expect(ldapFactoryUnc.isConfigured()).toBe(false);
});

test('getInstance2+url', async () => {
  process.env.LDAPURI = 'ldaps://ldaptest:1636/dc=iconicompany,dc=com';
  process.env.LDAPTLS_CACERT = 'test/openldap/certs/ca.crt';
  const ldapFactoryUrl = new LDAPFactory();

  const ldapResource = await ldapFactoryUrl.getLDAPResource();
  const resourceUrl = await ldapResource.lookup('com.iconicompany.apps.testapp.db');
  expect(resourceUrl).toBe('mysql://localhost/testapp');

  expect(ldapFactoryUrl.ldapConfig.base).toBe('dc=iconicompany,dc=com');

  ldapFactoryUrl.close();
});
