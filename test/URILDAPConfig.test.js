const URILDAPConfig = require('../src/URILDAPConfig.js');

const ldapConfig = new URILDAPConfig(
  'ldaps://devel.net.ilb.ru/c=ru',
  '/etc/ssl/certs/ourCAbundle.crt'
);

const expectedUri = ['ldaps://devel.net.ilb.ru'];

test('uri', () => {
  expect(ldapConfig.uri).toStrictEqual(expectedUri);
});

test('base', () => {
  expect(ldapConfig.base).toBe('c=ru');
});

test('caCert', () => {
  expect(ldapConfig.caCert).toBe('/etc/ssl/certs/ourCAbundle.crt');
});
