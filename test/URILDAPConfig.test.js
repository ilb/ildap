const URILDAPConfig = require('../src/URILDAPConfig.js');

test('ldapConfig', () => {
  const ldapConfig = new URILDAPConfig(
    'ldaps://devel.net.ilb.ru/c=ru',
    undefined,
    '/etc/ssl/certs/ourCAbundle.crt'
  );

  const expectedUri = ['ldaps://devel.net.ilb.ru'];

  expect(ldapConfig.uri).toStrictEqual(expectedUri);
  expect(ldapConfig.base).toBe('c=ru');
  expect(ldapConfig.caCert).toBe('/etc/ssl/certs/ourCAbundle.crt');
});

test('ldapConfig2', () => {
  const ldapConfig = new URILDAPConfig(
    'ldaps://devel.net.ilb.ru/',
    'c=ru',
    '/etc/ssl/certs/ourCAbundle.crt'
  );

  const expectedUri = ['ldaps://devel.net.ilb.ru'];

  expect(ldapConfig.uri).toStrictEqual(expectedUri);
  expect(ldapConfig.base).toBe('c=ru');
  expect(ldapConfig.caCert).toBe('/etc/ssl/certs/ourCAbundle.crt');
});
